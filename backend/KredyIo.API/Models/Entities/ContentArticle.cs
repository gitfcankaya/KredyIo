using System.ComponentModel.DataAnnotations;

namespace KredyIo.API.Models.Entities;

public class ContentArticle
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(500)]
    public string Slug { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? MetaDescription { get; set; }
    
    [MaxLength(200)]
    public string? MetaKeywords { get; set; }
    
    [MaxLength(50)]
    public string Category { get; set; } = "General"; // Loan, CreditCard, Deposit, Banking, News
    
    [MaxLength(500)]
    public string? FeaturedImageUrl { get; set; }
    
    [Required]
    public string Content { get; set; } = string.Empty; // HTML content
    
    [MaxLength(100)]
    public string? Author { get; set; }
    
    public int ReadingTimeMinutes { get; set; } = 5;
    public int ViewCount { get; set; } = 0;
    
    [MaxLength(1000)]
    public string? TableOfContents { get; set; } // JSON string
    
    [MaxLength(2000)]
    public string? RelatedArticleIds { get; set; } // JSON array of IDs
    
    public bool IsPublished { get; set; } = false;
    public bool IsFeatured { get; set; } = false;
    
    public DateTime PublishedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
