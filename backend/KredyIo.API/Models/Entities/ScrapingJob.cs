using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using KredyIo.API.Models.Enums;

namespace KredyIo.API.Models.Entities;

public class ScrapingJob
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [Column(TypeName = "nvarchar(200)")]
    public string JobName { get; set; } = null!;
    
    [Column(TypeName = "nvarchar(500)")]
    public string? Description { get; set; }
    
    [Required]
    public ScrapingDataType DataType { get; set; }
    
    [Required]
    public ScrapingMethod Method { get; set; }
    
    [Required]
    [Column(TypeName = "nvarchar(1000)")]
    public string SourceUrl { get; set; } = null!;
    
    [Required]
    public int FrequencyMinutes { get; set; } = 60; // Default: every hour
    
    [Column(TypeName = "TEXT")]
    public string? Configuration { get; set; } // JSON
    
    [Column(TypeName = "TEXT")]
    public string? Selectors { get; set; } // CSS/XPath selectors JSON
    
    public bool IsActive { get; set; } = true;
    
    public DateTime? LastRunAt { get; set; }
    
    public DateTime? LastSuccessAt { get; set; }
    
    public DateTime? NextRunAt { get; set; }
    
    public int TimeoutSeconds { get; set; } = 30;
    
    public int RetryCount { get; set; } = 3;
    
    [Column(TypeName = "nvarchar(500)")]
    public string? UserAgent { get; set; }
    
    [Column(TypeName = "TEXT")]
    public string? Headers { get; set; } // JSON
    
    [Column(TypeName = "TEXT")]
    public string? ErrorMessage { get; set; }
    
    public int SuccessfulRuns { get; set; } = 0;
    
    public int FailedRuns { get; set; } = 0;
    
    [Column(TypeName = "decimal(5,2)")]
    public decimal SuccessRate => SuccessfulRuns + FailedRuns > 0 
        ? (decimal)SuccessfulRuns / (SuccessfulRuns + FailedRuns) * 100 
        : 0;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? DeletedAt { get; set; }
    
    // Navigation properties
    public virtual ICollection<ScrapingResult> Results { get; set; } = new List<ScrapingResult>();
    public virtual ICollection<ScrapingJobLog> Logs { get; set; } = new List<ScrapingJobLog>();
}

public class ScrapingJobLog
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int ScrapingJobId { get; set; }
    public ScrapingJob ScrapingJob { get; set; } = null!;
    
    [Required]
    public ScrapingStatus Status { get; set; }
    
    [Required]
    [Column(TypeName = "nvarchar(100)")]
    public string Action { get; set; } = null!; // Started, Completed, Failed, etc.
    
    [Column(TypeName = "TEXT")]
    public string? Message { get; set; }
    
    [Column(TypeName = "TEXT")]
    public string? Details { get; set; } // JSON
    
    public DateTime LoggedAt { get; set; } = DateTime.UtcNow;
}