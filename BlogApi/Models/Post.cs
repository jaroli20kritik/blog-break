using System;
using System.ComponentModel.DataAnnotations;

namespace BlogApi.Models
{
    public class Post
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        [StringLength(500)]
        public string Summary { get; set; }

        public string? ImageUrl { get; set; }

        public DateTime PublishedDate { get; set; } = DateTime.UtcNow;

        [Required]
        public string Category { get; set; }
    }
}
