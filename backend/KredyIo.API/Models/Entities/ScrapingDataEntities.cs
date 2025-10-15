using KredyIo.API.Models.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KredyIo.API.Models.Entities;

public class ScrapingResult
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int ScrapingJobId { get; set; }
    public ScrapingJob ScrapingJob { get; set; } = null!;
    
    [Required]
    public ScrapingStatus Status { get; set; }
    
    [Required]
    public DateTime StartTime { get; set; }
    
    public DateTime? EndTime { get; set; }
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal? Duration { get; set; } // seconds
    
    public int RecordsFound { get; set; }
    
    public int RecordsUpdated { get; set; }
    
    public int RecordsCreated { get; set; }
    
    public int RecordsDeleted { get; set; }
    
    [Column(TypeName = "TEXT")]
    public string? RawData { get; set; }
    
    [Column(TypeName = "TEXT")]
    public string? ProcessedData { get; set; }
    
    [Column(TypeName = "TEXT")]
    public string? ErrorMessage { get; set; }
    
    [Column(TypeName = "TEXT")]
    public string? StackTrace { get; set; }
    
    [Column(TypeName = "nvarchar(500)")]
    public string? UserAgent { get; set; }
    
    [Column(TypeName = "nvarchar(100)")]
    public string? IpAddress { get; set; }
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal? ResponseTime { get; set; } // milliseconds
    
    public int? HttpStatusCode { get; set; }
    
    [Column(TypeName = "TEXT")]
    public string? Metadata { get; set; } // JSON
    
    public bool IsSuccessful => Status == ScrapingStatus.Completed;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class CurrencyRate
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [Column(TypeName = "nvarchar(10)")]
    public string CurrencyCode { get; set; } = null!;
    
    [Required]
    [Column(TypeName = "nvarchar(100)")]
    public string CurrencyName { get; set; } = null!;
    
    [Required]
    [Column(TypeName = "decimal(18,6)")]
    public decimal BuyingRate { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(18,6)")]
    public decimal SellingRate { get; set; }
    
    [Column(TypeName = "decimal(18,6)")]
    public decimal? CentralRate { get; set; }
    
    [Column(TypeName = "decimal(18,6)")]
    public decimal? PreviousRate { get; set; }
    
    [Column(TypeName = "decimal(8,4)")]
    public decimal? ChangePercent { get; set; }
    
    [Column(TypeName = "decimal(18,6)")]
    public decimal? ChangeAmount { get; set; }
    
    [Required]
    [Column(TypeName = "nvarchar(50)")]
    public string Source { get; set; } = null!; // TCMB, XE, etc.
    
    [Required]
    public DateTime RateDate { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class GoldPrice
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [Column(TypeName = "nvarchar(50)")]
    public string GoldType { get; set; } = null!; // Gram, Quarter, Half, Full, etc.
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal BuyingPrice { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal SellingPrice { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal? PreviousPrice { get; set; }
    
    [Column(TypeName = "decimal(8,4)")]
    public decimal? ChangePercent { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal? ChangeAmount { get; set; }
    
    [Required]
    [Column(TypeName = "nvarchar(50)")]
    public string Source { get; set; } = null!;
    
    [Required]
    public DateTime PriceDate { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class StockData
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [Column(TypeName = "nvarchar(10)")]
    public string Symbol { get; set; } = null!; // ISCTR, GARAN, etc.
    
    [Required]
    [Column(TypeName = "nvarchar(100)")]
    public string CompanyName { get; set; } = null!;
    
    [Required]
    [Column(TypeName = "decimal(18,4)")]
    public decimal CurrentPrice { get; set; }
    
    [Column(TypeName = "decimal(18,4)")]
    public decimal? OpenPrice { get; set; }
    
    [Column(TypeName = "decimal(18,4)")]
    public decimal? HighPrice { get; set; }
    
    [Column(TypeName = "decimal(18,4)")]
    public decimal? LowPrice { get; set; }
    
    [Column(TypeName = "decimal(18,4)")]
    public decimal? PreviousClose { get; set; }
    
    [Column(TypeName = "decimal(8,4)")]
    public decimal? ChangePercent { get; set; }
    
    [Column(TypeName = "decimal(18,4)")]
    public decimal? ChangeAmount { get; set; }
    
    public long? Volume { get; set; }
    
    [Column(TypeName = "decimal(20,2)")]
    public decimal? MarketCap { get; set; }
    
    [Required]
    [Column(TypeName = "nvarchar(50)")]
    public string Source { get; set; } = null!; // BIST, Yahoo, etc.
    
    [Required]
    public DateTime DataDate { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class NewsArticle
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [Column(TypeName = "nvarchar(500)")]
    public string Title { get; set; } = null!;
    
    [Column(TypeName = "nvarchar(1000)")]
    public string? Summary { get; set; }
    
    [Column(TypeName = "TEXT")]
    public string? Content { get; set; }
    
    [Required]
    [Column(TypeName = "nvarchar(1000)")]
    public string SourceUrl { get; set; } = null!;
    
    [Required]
    [Column(TypeName = "nvarchar(100)")]
    public string Source { get; set; } = null!; // Bloomberg, Ekonomist, etc.
    
    [Column(TypeName = "nvarchar(200)")]
    public string? Author { get; set; }
    
    [Column(TypeName = "nvarchar(500)")]
    public string? ImageUrl { get; set; }
    
    [Column(TypeName = "nvarchar(500)")]
    public string? Tags { get; set; } // JSON array
    
    [Column(TypeName = "nvarchar(100)")]
    public string? Category { get; set; }
    
    [Required]
    public DateTime PublishedAt { get; set; }
    
    public DateTime ScrapedAt { get; set; } = DateTime.UtcNow;
    
    public bool IsActive { get; set; } = true;
    
    public int ViewCount { get; set; } = 0;
}

public class EconomicIndicator
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [Column(TypeName = "nvarchar(100)")]
    public string IndicatorCode { get; set; } = null!; // ENFLASYON, BUYUME, etc.
    
    [Required]
    [Column(TypeName = "nvarchar(200)")]
    public string IndicatorName { get; set; } = null!;
    
    [Required]
    [Column(TypeName = "decimal(18,6)")]
    public decimal Value { get; set; }
    
    [Column(TypeName = "nvarchar(20)")]
    public string? Unit { get; set; } // %, TL, etc.
    
    [Column(TypeName = "nvarchar(20)")]
    public string? Period { get; set; } // Aylık, Yıllık, etc.
    
    [Column(TypeName = "decimal(18,6)")]
    public decimal? PreviousValue { get; set; }
    
    [Column(TypeName = "decimal(8,4)")]
    public decimal? ChangePercent { get; set; }
    
    [Required]
    [Column(TypeName = "nvarchar(50)")]
    public string Source { get; set; } = null!; // TCMB, TÜİK, etc.
    
    [Required]
    public DateTime DataDate { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}