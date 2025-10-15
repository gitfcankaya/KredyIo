using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KredyIo.API.Models.Entities;

public class SystemSetting
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [Column(TypeName = "nvarchar(100)")]
    public string Key { get; set; } = null!;
    
    [Column(TypeName = "nvarchar(1000)")]
    public string? Value { get; set; }
    
    [Column(TypeName = "nvarchar(500)")]
    public string? Description { get; set; }
    
    [Column(TypeName = "nvarchar(50)")]
    public string? Category { get; set; }
    
    [Column(TypeName = "nvarchar(50)")]
    public string? DataType { get; set; } = "string"; // string, int, bool, decimal, json
    
    public bool IsRequired { get; set; } = false;
    
    public bool IsVisible { get; set; } = true;
    
    public int SortOrder { get; set; } = 0;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class UserFavorite
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    
    [Required]
    [Column(TypeName = "nvarchar(50)")]
    public string EntityType { get; set; } = null!; // Product, DepositProduct, CreditCard, etc.
    
    [Required]
    public int EntityId { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class UserComparison
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    
    [Required]
    [Column(TypeName = "nvarchar(200)")]
    public string ComparisonName { get; set; } = null!;
    
    [Required]
    [Column(TypeName = "nvarchar(50)")]
    public string EntityType { get; set; } = null!;
    
    [Required]
    [Column(TypeName = "TEXT")]
    public string EntityIds { get; set; } = null!; // JSON array of IDs
    
    [Column(TypeName = "TEXT")]
    public string? Notes { get; set; }
    
    public bool IsPublic { get; set; } = false;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class Article
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [Column(TypeName = "nvarchar(300)")]
    public string Title { get; set; } = null!;
    
    [Column(TypeName = "nvarchar(500)")]
    public string? Slug { get; set; }
    
    [Column(TypeName = "nvarchar(1000)")]
    public string? Summary { get; set; }
    
    [Column(TypeName = "TEXT")]
    public string? Content { get; set; }
    
    [Column(TypeName = "nvarchar(100)")]
    public string? Category { get; set; }
    
    [Column(TypeName = "nvarchar(500)")]
    public string? Tags { get; set; } // JSON array
    
    [Column(TypeName = "nvarchar(500)")]
    public string? FeaturedImage { get; set; }
    
    [Column(TypeName = "nvarchar(200)")]
    public string? Author { get; set; }
    
    public bool IsPublished { get; set; } = false;
    
    public bool IsFeatured { get; set; } = false;
    
    public int ViewCount { get; set; } = 0;
    
    public DateTime? PublishedAt { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class NewsItem
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [Column(TypeName = "nvarchar(500)")]
    public string Title { get; set; } = null!;
    
    [Column(TypeName = "nvarchar(1000)")]
    public string? Summary { get; set; }
    
    [Required]
    [Column(TypeName = "nvarchar(1000)")]
    public string SourceUrl { get; set; } = null!;
    
    [Required]
    [Column(TypeName = "nvarchar(100)")]
    public string Source { get; set; } = null!;
    
    [Column(TypeName = "nvarchar(500)")]
    public string? ImageUrl { get; set; }
    
    [Column(TypeName = "nvarchar(100)")]
    public string? Category { get; set; }
    
    [Column(TypeName = "nvarchar(500)")]
    public string? Tags { get; set; }
    
    public DateTime PublishedAt { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public bool IsActive { get; set; } = true;
}

public class FAQ
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [Column(TypeName = "nvarchar(500)")]
    public string Question { get; set; } = null!;
    
    [Required]
    [Column(TypeName = "TEXT")]
    public string Answer { get; set; } = null!;
    
    [Column(TypeName = "nvarchar(100)")]
    public string? Category { get; set; }
    
    public int SortOrder { get; set; } = 0;
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}