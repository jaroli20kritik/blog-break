using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using RestaurantBackend.Data;
using RestaurantBackend.Models;
using RestaurantBackend.Hubs;

namespace RestaurantBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly RestaurantDbContext _context;
    private readonly IHubContext<OrderHub> _hubContext;

    public PaymentController(RestaurantDbContext context, IHubContext<OrderHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    public class PaymentInitiateRequest
    {
        public int OrderId { get; set; }
        public string PaymentMethod { get; set; } = "Razorpay";
    }

    [HttpPost("initiate")]
    public async Task<IActionResult> InitiatePayment([FromBody] PaymentInitiateRequest request)
    {
        var order = await _context.Orders.FindAsync(request.OrderId);
        if (order == null) return NotFound("Order not found");

        var payment = new Payment
        {
            OrderId = order.Id,
            Amount = order.TotalAmount,
            PaymentMethod = request.PaymentMethod,
            Status = "Pending"
        };
        
        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        // In a real scenario, this is where we would call the Razorpay API to generate an order ID
        return Ok(new { PaymentId = payment.Id, RazorpayOrderId = Guid.NewGuid().ToString("N"), Amount = payment.Amount });
    }

    [HttpPost("confirm/{paymentId}")]
    public async Task<IActionResult> ConfirmPayment(int paymentId)
    {
        var payment = await _context.Payments.FindAsync(paymentId);
        if (payment == null) return NotFound();

        payment.Status = "Completed";
        
        var order = await _context.Orders.FindAsync(payment.OrderId);
        if (order != null) 
        {
             order.IsPaid = true;
             // Check for completion
             if (order.IsPrepared && order.IsServed && order.IsPaid)
             {
                 order.Status = "Completed";
             }
             else
             {
                 order.Status = "Paid";
             }
        }
        
        await _context.SaveChangesAsync();
        await _hubContext.Clients.All.SendAsync("OrderUpdated");
        return Ok(payment);
    }

    [HttpPost("fail/{paymentId}")]
    public async Task<IActionResult> FailPayment(int paymentId)
    {
        var payment = await _context.Payments.FindAsync(paymentId);
        if (payment == null) return NotFound();

        payment.Status = "Failed";
        await _context.SaveChangesAsync();
        return Ok(payment);
    }
}
