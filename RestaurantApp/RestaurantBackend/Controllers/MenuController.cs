using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using RestaurantBackend.Data;
using RestaurantBackend.Models;

namespace RestaurantBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MenuController : ControllerBase
{
    private readonly RestaurantDbContext _context;

    public MenuController(RestaurantDbContext context)
    {
        _context = context;
    }

    // Public: get full menu
    [HttpGet]
    public async Task<IActionResult> GetMenu()
    {
        var menu = await _context.MenuCategories
            .Include(c => c.Items.Where(i => i.IsAvailable))
            .OrderBy(c => c.Id)
            .ToListAsync();
        return Ok(menu);
    }

    // Owner: get all items including unavailable
    [HttpGet("admin")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> GetMenuAdmin()
    {
        var menu = await _context.MenuCategories
            .Include(c => c.Items)
            .OrderBy(c => c.Id)
            .ToListAsync();
        return Ok(menu);
    }

    // Owner: add category
    [HttpPost("category")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> AddCategory([FromBody] MenuCategory category)
    {
        _context.MenuCategories.Add(category);
        await _context.SaveChangesAsync();
        return Ok(category);
    }

    // Owner: delete category
    [HttpDelete("category/{id}")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _context.MenuCategories
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.Id == id);
        if (category == null) return NotFound();

        // Get all item IDs in this category
        var itemIds = category.Items.Select(i => i.Id).ToList();

        // Detach order items referencing these menu items to avoid FK violation
        if (itemIds.Any())
        {
            var affectedOrderItems = await _context.OrderItems
                .Where(oi => itemIds.Contains(oi.MenuItemId))
                .ToListAsync();
            _context.OrderItems.RemoveRange(affectedOrderItems);
        }

        // Remove all the menu items
        _context.MenuItems.RemoveRange(category.Items);

        // Remove the category itself
        _context.MenuCategories.Remove(category);

        await _context.SaveChangesAsync();
        return Ok(new { message = "Category deleted" });
    }

    // Owner: add menu item
    [HttpPost("item")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> AddItem([FromBody] MenuItem item)
    {
        _context.MenuItems.Add(item);
        await _context.SaveChangesAsync();
        return Ok(item);
    }

    // Owner: update menu item
    [HttpPut("item/{id}")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> UpdateItem(int id, [FromBody] MenuItem updated)
    {
        var item = await _context.MenuItems.FindAsync(id);
        if (item == null) return NotFound();
        item.Name = updated.Name;
        item.Price = updated.Price;
        item.IsAvailable = updated.IsAvailable;
        item.CategoryId = updated.CategoryId;
        await _context.SaveChangesAsync();
        return Ok(item);
    }

    // Owner: delete menu item
    [HttpDelete("item/{id}")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> DeleteItem(int id)
    {
        var item = await _context.MenuItems.FindAsync(id);
        if (item == null) return NotFound();
        _context.MenuItems.Remove(item);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Deleted" });
    }

    // Owner: toggle item availability
    [HttpPatch("item/{id}/toggle")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> ToggleAvailability(int id)
    {
        var item = await _context.MenuItems.FindAsync(id);
        if (item == null) return NotFound();
        item.IsAvailable = !item.IsAvailable;
        await _context.SaveChangesAsync();
        return Ok(item);
    }
}
