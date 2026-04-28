using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using RestaurantBackend.Data;
using RestaurantBackend.Models;
using RestaurantBackend.Hubs;

namespace RestaurantBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TableController : ControllerBase
{
    private readonly RestaurantDbContext _context;
    private readonly IHubContext<OrderHub> _hubContext;

    public TableController(RestaurantDbContext context, IHubContext<OrderHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    // Public: create/retrieve session for table
    [HttpGet("{tableNumber}")]
    public async Task<IActionResult> GetOrCreateSession(int tableNumber)
    {
        var table = await _context.Tables.FirstOrDefaultAsync(t => t.TableNumber == tableNumber);
        if (table == null) return NotFound("Table not found");

        var activeSession = await _context.TableSessions
            .FirstOrDefaultAsync(s => s.TableId == table.Id && s.IsActive);

        if (activeSession != null) return Ok(activeSession);

        var newSession = new TableSession {
            TableId = table.Id,
            SessionToken = Guid.NewGuid().ToString("N")
        };
        table.Status = "Occupied";
        _context.TableSessions.Add(newSession);
        await _context.SaveChangesAsync();
        return Ok(newSession);
    }

    // Public: all tables list (for QR generation)
    [HttpGet("all")]
    public async Task<IActionResult> GetTables()
    {
        var tables = await _context.Tables.OrderBy(t => t.TableNumber).ToListAsync();
        return Ok(tables);
    }

    // Owner: all tables with status and current order info
    [HttpGet("status")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> GetTableStatus()
    {
        var tables = await _context.Tables
            .Include(t => t.Sessions.Where(s => s.IsActive))
            .OrderBy(t => t.TableNumber)
            .ToListAsync();

        var result = await Task.WhenAll(tables.Select(async t => {
            var activeOrders = await _context.Orders
                .Include(o => o.Items).ThenInclude(i => i.MenuItem)
                .Where(o => o.TableId == t.Id && o.Status != "Served" && o.Status != "Paid")
                .ToListAsync();
            string serviceStatus = "Empty";
            if (activeOrders.Any()) {
                if (activeOrders.Any(o => !o.IsPrepared)) serviceStatus = "Pending";
                else if (activeOrders.Any(o => !o.IsServed)) serviceStatus = "Preparing";
                else serviceStatus = "Served";
            }

            return new {
                t.Id, t.TableNumber, t.Status,
                hasActiveSession = t.Sessions.Any(),
                activeOrders = activeOrders.Count,
                totalAmount = activeOrders.Sum(o => o.TotalAmount),
                serviceStatus
            };
        }));

        return Ok(result);
    }

    // Owner: reset table (clear session, mark Available)
    [HttpPost("reset/{tableId}")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> ResetTable(int tableId)
    {
        var table = await _context.Tables
            .Include(t => t.Sessions)
            .FirstOrDefaultAsync(t => t.Id == tableId);

        if (table == null) return NotFound();

        // 1. Deactivate all sessions
        foreach (var session in table.Sessions.Where(s => s.IsActive))
            session.IsActive = false;

        // 2. Clear all active orders for this table
        var activeOrders = await _context.Orders
            .Where(o => o.TableId == tableId && o.Status != "Paid" && o.Status != "Canceled")
            .ToListAsync();

        foreach (var order in activeOrders)
        {
            // If already served but not paid, mark as Completed (implied paid on reset). 
            // If still pending/preparing, mark as Canceled.
            if (order.Status == "Served" || (order.IsServed && order.IsPrepared))
            {
                order.IsPaid = true;
                order.IsServed = true;
                order.IsPrepared = true;
                order.Status = "Completed";
            }
            else
            {
                order.Status = "Canceled";
            }
        }

        // 3. Mark table as available
        table.Status = "Available";

        await _context.SaveChangesAsync();

        // 4. Notify everyone that orders/tables changed
        await _hubContext.Clients.Group($"table-{table.Id}").SendAsync("SessionEnded");
        
        foreach (var order in activeOrders)
        {
            await _hubContext.Clients.Group("owners").SendAsync("OrderUpdated", order.Id);
            await _hubContext.Clients.Group($"table-{table.Id}").SendAsync("OrderStatusChanged", order.Id, order.Status);
        }

        return Ok(new { message = $"Table {table.TableNumber} reset successfully. {activeOrders.Count} orders cleared." });
    }
}
