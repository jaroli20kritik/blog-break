namespace RestaurantBackend.Models;

public class TableSession
{
    public int Id { get; set; }
    public int TableId { get; set; }
    public Table? Table { get; set; }
    public string SessionToken { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
}
