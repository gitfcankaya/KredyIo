using System.ComponentModel.DataAnnotations;

namespace KredyIo.API.Models.Entities;

public class DepositRate
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int BankId { get; set; }
    
    [Required]
    [MaxLength(10)]
    public string Currency { get; set; } = "TRY"; // TRY, USD, EUR, GBP
    
    public int TermMonths { get; set; } // 1, 3, 6, 9, 12, 24
    
    public decimal InterestRate { get; set; }
    
    public decimal? MinAmount { get; set; }
    public decimal? MaxAmount { get; set; }
    
    public bool HasCampaign { get; set; } = false;
    [MaxLength(500)]
    public string? CampaignDetails { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public DateTime EffectiveDate { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public virtual Bank Bank { get; set; } = null!;
}
