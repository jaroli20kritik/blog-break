namespace RestaurantBackend.Models;

public class MenuItem
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsVeg { get; set; } = true;
    public decimal Price { get; set; }
    public int CategoryId { get; set; }
    public MenuCategory? Category { get; set; }
    public bool IsAvailable { get; set; } = true;
}
