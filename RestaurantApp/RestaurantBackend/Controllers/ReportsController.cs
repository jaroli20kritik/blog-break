using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using RestaurantBackend.Data;
using RestaurantBackend.Models;

namespace RestaurantBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly RestaurantDbContext _context;

    public ReportsController(RestaurantDbContext context)
    {
        _context = context;
    }

    [HttpGet("revenue")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> GetRevenue()
    {
        var allOrders = await _context.Orders.ToListAsync();
        var allPayments = await _context.Payments.ToListAsync();

        var todayUtc = DateTime.UtcNow.Date;
        var todayOrders = allOrders.Where(o => o.CreatedAt.Date == todayUtc).ToList();
        var completedPayments = allPayments.Where(p => p.Status == "Completed").ToList();

        // Last 7 days revenue
        var last7Days = Enumerable.Range(0, 7).Select(i => {
            var day = todayUtc.AddDays(-i);
            var dayRevenue = allOrders
                .Where(o => o.CreatedAt.Date == day && o.Status == "Completed")
                .Sum(o => o.TotalAmount);
            return new { date = day.ToString("MMM dd"), revenue = dayRevenue };
        }).Reverse().ToList();

        return Ok(new {
            totalRevenue = allOrders.Where(o => o.Status == "Completed").Sum(o => o.TotalAmount),
            totalOrders = allOrders.Count,
            todayOrders = todayOrders.Count,
            todayRevenue = todayOrders.Where(o => o.Status == "Completed").Sum(o => o.TotalAmount),
            avgOrderValue = allOrders.Count > 0 ? allOrders.Average(o => o.TotalAmount) : 0,
            pendingOrders = allOrders.Count(o => !o.IsPrepared && !o.IsServed && o.Status != "Canceled"),
            preparingOrders = allOrders.Count(o => o.IsPrepared && !o.IsServed && o.Status != "Canceled"),
            last7Days
        });
    }

    [HttpGet("payments")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> GetPayments([FromQuery] int page = 1, [FromQuery] int pageSize = 15)
    {
        var query = _context.Payments
            .Include(p => p.Order).ThenInclude(o => o!.Table)
            .OrderByDescending(p => p.Id);

        var total = await query.CountAsync();
        var payments = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return Ok(new { total, page, pageSize, payments });
    }
}
