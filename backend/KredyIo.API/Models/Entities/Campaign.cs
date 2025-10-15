using System.ComponentModel.DataAnnotations;

namespace KredyIo.API.Models.Entities;

public class Campaign
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int BankId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string CampaignType { get; set; } = string.Empty; // Loan, CreditCard, Deposit, Retirement, Employee
    
    [MaxLength(2000)]
    public string? Description { get; set; }
    
    public decimal? BonusAmount { get; set; }
    public decimal? DiscountRate { get; set; }
    
    [MaxLength(500)]
    public string? Conditions { get; set; }
    
    [MaxLength(500)]
    public string? ImageUrl { get; set; }
    
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    
    public bool IsActive { get; set; } = true;
    public bool IsFeatured { get; set; } = false;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public virtual Bank Bank { get; set; } = null!;
}
