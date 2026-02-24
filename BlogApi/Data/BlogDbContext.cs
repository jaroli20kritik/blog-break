using Microsoft.EntityFrameworkCore;
using BlogApi.Models;

namespace BlogApi.Data
{
    public class BlogDbContext : DbContext
    {
        public BlogDbContext(DbContextOptions<BlogDbContext> options) : base(options)
        {
        }

        public DbSet<Post> Posts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Seed initial data
            modelBuilder.Entity<Post>().HasData(
                new Post
                {
                    Id = 1,
                    Title = "How to Hold On to God’s Promises During Tough Times",
                    Summary = "The Newbreak Church blog takes the message from the weekend and lays out next right steps...",
                    Content = "God’s promises are true even when life is hard. In this post, we explore how to stay faithful...",
                    Category = "Faith",
                    ImageUrl = "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=1000&auto=format&fit=crop",
                    PublishedDate = new DateTime(2026, 2, 20, 10, 0, 0, DateTimeKind.Utc)
                },
                new Post
                {
                    Id = 2,
                    Title = "A New Year with New Habits",
                    Summary = "Starting the year with spiritual disciplines can transform your walk with Christ.",
                    Content = "Developing new habits isn't just about willpower; it's about surrender...",
                    Category = "Growth",
                    ImageUrl = "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=1000&auto=format&fit=crop",
                    PublishedDate = new DateTime(2026, 2, 22, 14, 30, 0, DateTimeKind.Utc)
                }
            );
        }
    }
}
