using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using RestaurantBackend.Data;
using RestaurantBackend.Models;
using RestaurantBackend.Hubs;

namespace RestaurantBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly RestaurantDbContext _context;
    private readonly IHubContext<OrderHub> _hubContext;

    public OrderController(RestaurantDbContext context, IHubContext<OrderHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    public class CreateOrderRequest
    {
        public int TableId { get; set; }
        public string SessionToken { get; set; } = string.Empty;
        public List<OrderItemRequest> Items { get; set; } = new();
    }

    public class OrderItemRequest
    {
        public int MenuItemId { get; set; }
        public int Quantity { get; set; }
    }

    // Customer: place an order
    [HttpPost("create")]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
    {
        var session = await _context.TableSessions
            .FirstOrDefaultAsync(s => s.TableId == request.TableId && s.SessionToken == request.SessionToken && s.IsActive);
        if (session == null) return Unauthorized("Invalid or expired session.");

        var order = new Order { TableId = request.TableId, SessionId = session.Id, TotalAmount = 0 };

        foreach (var itemReq in request.Items)
        {
            var menuItem = await _context.MenuItems.FindAsync(itemReq.MenuItemId);
            if (menuItem != null)
            {
                order.Items.Add(new OrderItem {
                    MenuItemId = menuItem.Id,
                    Quantity = itemReq.Quantity,
                    Price = menuItem.Price
                });
                order.TotalAmount += menuItem.Price * itemReq.Quantity;
            }
        }

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        // Notify all owners of new order
        await _hubContext.Clients.Group("owners").SendAsync("NewOrder", order.Id);
        // Notify the table group
        await _hubContext.Clients.Group($"table-{request.TableId}").SendAsync("OrderCreated", order.Id);

        return Ok(order);
    }

    // Customer: track own table orders
    [HttpGet("table/{tableId}")]
    public async Task<IActionResult> GetTableOrders(int tableId, [FromQuery] string? sessionToken)
    {
        // 1. Find active session for this table
        var activeSession = await _context.TableSessions
            .FirstOrDefaultAsync(s => s.TableId == tableId && s.IsActive);

        if (activeSession == null)
        {
            // If no active session, table is Available. Show nothing.
            return Ok(new List<Order>());
        }

        // 2. Return only orders for this specific session
        var orders = await _context.Orders
            .Include(o => o.Items).ThenInclude(i => i.MenuItem)
            .Where(o => o.TableId == tableId && o.SessionId == activeSession.Id)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
        return Ok(orders);
    }

    // Owner: kitchen view (active orders only)
    [HttpGet("kitchen")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> GetKitchenOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.Table)
            .Include(o => o.Items).ThenInclude(i => i.MenuItem)
            .Where(o => o.Status != "Served" && o.Status != "Completed" && o.Status != "Canceled")
            .OrderBy(o => o.CreatedAt)
            .ToListAsync();
        return Ok(orders);
    }

    // Owner: all orders (admin view)
    [HttpGet("all")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> GetAllOrders([FromQuery] string? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var query = _context.Orders
            .Include(o => o.Table)
            .Include(o => o.Items).ThenInclude(i => i.MenuItem)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(o => o.Status == status);

        var total = await query.CountAsync();
        var orders = await query
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new { total, page, pageSize, orders });
    }

    [HttpPost("{orderId}/status")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] string status)
    {
        var order = await _context.Orders.FindAsync(orderId);
        if (order == null) return NotFound();
        
        // Update flags based on status
        if (status == "Preparing") order.IsPrepared = true;
        if (status == "Served") 
        { 
            order.IsPrepared = true; 
            order.IsServed = true; 
        }
        if (status == "Paid") order.IsPaid = true;

        // Check for completion
        if (order.IsPrepared && order.IsServed && order.IsPaid)
        {
            order.Status = "Completed";
        }
        else
        {
            order.Status = status;
        }

        await _context.SaveChangesAsync();

        // Notify owners
        await _hubContext.Clients.Group("owners").SendAsync("OrderUpdated", orderId, order.Status);
        // Notify the specific table
        await _hubContext.Clients.Group($"table-{order.TableId}").SendAsync("OrderStatusChanged", orderId, order.Status);

        return Ok(order);
    }
}
