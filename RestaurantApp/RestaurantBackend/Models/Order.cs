namespace RestaurantBackend.Models;

public class Order
{
    public int Id { get; set; }
    public int TableId { get; set; }
    public Table? Table { get; set; }
    public int? SessionId { get; set; }
    public TableSession? Session { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Preparing, Served, Paid, Completed
    public bool IsPrepared { get; set; } = false;
    public bool IsServed { get; set; } = false;
    public bool IsPaid { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public decimal TotalAmount { get; set; }
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
