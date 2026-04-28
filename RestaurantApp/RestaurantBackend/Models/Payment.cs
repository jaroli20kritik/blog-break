namespace RestaurantBackend.Models;

public class Payment
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order? Order { get; set; }
    public decimal Amount { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Completed, Failed
    public string PaymentMethod { get; set; } = string.Empty; // Razorpay, Cash
}
