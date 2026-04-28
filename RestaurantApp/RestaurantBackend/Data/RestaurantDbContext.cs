using Microsoft.EntityFrameworkCore;
using RestaurantBackend.Models;

namespace RestaurantBackend.Data;

public class RestaurantDbContext : DbContext
{
    public RestaurantDbContext(DbContextOptions<RestaurantDbContext> options) : base(options) { }

    public DbSet<Table> Tables { get; set; }
    public DbSet<TableSession> TableSessions { get; set; }
    public DbSet<MenuCategory> MenuCategories { get; set; }
    public DbSet<MenuItem> MenuItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<AppUser> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Seed admin user (password: saisagar@123)
        modelBuilder.Entity<AppUser>().HasData(
            new AppUser 
            { 
                Id = 1, 
                Username = "admin", 
                PasswordHash = "saisagar@123",
                Role = "Owner" 
            }
        );

        modelBuilder.Entity<Table>().HasData(
            new Table { Id = 1, TableNumber = 1 },
            new Table { Id = 2, TableNumber = 2 },
            new Table { Id = 3, TableNumber = 3 }
        );

        modelBuilder.Entity<MenuCategory>().HasData(
            new MenuCategory { Id = 1, Name = "Saisagar Tandoor Tadka" },
            new MenuCategory { Id = 2, Name = "Sandwiches" },
            new MenuCategory { Id = 3, Name = "Fries and Nachos" },
            new MenuCategory { Id = 4, Name = "All Time Favourite Appetizers" }
        );

        modelBuilder.Entity<MenuItem>().HasData(
            // Tandoor Tadka
            new MenuItem { Id = 1, Name = "Paneer Tikka", Price = 150m, CategoryId = 1 },
            new MenuItem { Id = 2, Name = "Paneer Achari Tikka", Price = 170m, CategoryId = 1 },
            new MenuItem { Id = 3, Name = "Paneer Malai Tikka", Price = 180m, CategoryId = 1 },
            new MenuItem { Id = 4, Name = "Mushroom Tikka", Price = 180m, CategoryId = 1 },
            new MenuItem { Id = 5, Name = "Soya Chaap", Price = 140m, CategoryId = 1 },
            new MenuItem { Id = 6, Name = "Achari Soya Chaap", Price = 150m, CategoryId = 1 },
            new MenuItem { Id = 7, Name = "Afghani Soya Chaap", Price = 170m, CategoryId = 1 },
            new MenuItem { Id = 8, Name = "Tandoori Veg Momos", Price = 140m, CategoryId = 1 },
            new MenuItem { Id = 9, Name = "Afghani Momos", Price = 150m, CategoryId = 1 },
            new MenuItem { Id = 10, Name = "Tandoori Paneer Momos", Price = 150m, CategoryId = 1 },
            new MenuItem { Id = 11, Name = "Tandoori Spring Roll", Price = 150m, CategoryId = 1 },
            
            // Sandwiches
            new MenuItem { Id = 12, Name = "Veg Sandwich", Price = 100m, CategoryId = 2 },
            new MenuItem { Id = 13, Name = "Masala Sandwich", Price = 100m, CategoryId = 2 },
            new MenuItem { Id = 14, Name = "Schezwan Sandwich", Price = 100m, CategoryId = 2 },
            new MenuItem { Id = 15, Name = "Plain Cheese Sandwich", Price = 100m, CategoryId = 2 },
            new MenuItem { Id = 16, Name = "Cheese Chutney Sandwich", Price = 100m, CategoryId = 2 },
            new MenuItem { Id = 17, Name = "Veg Cheese Sandwich", Price = 120m, CategoryId = 2 },
            new MenuItem { Id = 18, Name = "Masala Cheese Sandwich", Price = 120m, CategoryId = 2 },
            new MenuItem { Id = 19, Name = "Tandoori Veg Sandwich", Price = 120m, CategoryId = 2 },
            new MenuItem { Id = 20, Name = "Tandoori Paneer Sandwich", Price = 120m, CategoryId = 2 },
            new MenuItem { Id = 21, Name = "Corn Capsicum Sandwich", Price = 120m, CategoryId = 2 },
            new MenuItem { Id = 22, Name = "Maggie Sandwich", Price = 140m, CategoryId = 2 },
            new MenuItem { Id = 23, Name = "Nutella Sandwich", Price = 140m, CategoryId = 2 },
            
            // Fries and Nachos
            new MenuItem { Id = 24, Name = "French Fries", Price = 90m, CategoryId = 3 },
            new MenuItem { Id = 25, Name = "Plain Nachos", Price = 90m, CategoryId = 3 },
            new MenuItem { Id = 26, Name = "Peri Peri Masala Fries", Price = 100m, CategoryId = 3 },
            new MenuItem { Id = 27, Name = "Mayo Chilli Fries", Price = 130m, CategoryId = 3 },
            new MenuItem { Id = 28, Name = "Cheese Chipotle Fries", Price = 130m, CategoryId = 3 },
            new MenuItem { Id = 29, Name = "Cheesey Peri Peri Fries", Price = 130m, CategoryId = 3 },
            new MenuItem { Id = 30, Name = "Salsa Mexican Fries", Price = 130m, CategoryId = 3 },
            new MenuItem { Id = 31, Name = "Mint Mayo Fries", Price = 130m, CategoryId = 3 },
            new MenuItem { Id = 32, Name = "Nutella Fries", Price = 130m, CategoryId = 3 },
            new MenuItem { Id = 33, Name = "Mayo Chilli Nachos", Price = 130m, CategoryId = 3 },
            new MenuItem { Id = 34, Name = "Cheese Chipotle Nachos", Price = 130m, CategoryId = 3 },
            new MenuItem { Id = 35, Name = "Cheesey Peri Peri Nachos", Price = 130m, CategoryId = 3 },
            new MenuItem { Id = 36, Name = "Salsa Mexican Nachos", Price = 130m, CategoryId = 3 },
            
            // Appetizers
            new MenuItem { Id = 37, Name = "Potato Twister", Price = 100m, CategoryId = 4 },
            new MenuItem { Id = 38, Name = "Special Garlic Bread", Price = 100m, CategoryId = 4 },
            new MenuItem { Id = 39, Name = "Red Pasta", Price = 140m, CategoryId = 4 },
            new MenuItem { Id = 40, Name = "White Pasta", Price = 150m, CategoryId = 4 }
        );
    }
}
