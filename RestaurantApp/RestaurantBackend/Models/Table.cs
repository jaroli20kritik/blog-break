namespace RestaurantBackend.Models;

public class Table
{
    public int Id { get; set; }
    public int TableNumber { get; set; }
    public string Status { get; set; } = "Available"; // Available, Occupied
    public ICollection<TableSession> Sessions { get; set; } = new List<TableSession>();
}
