using System.ComponentModel.DataAnnotations;

namespace KredyIo.API.Models.Entities;

public class CreditCardProduct
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int BankId { get; set; }
    
    [Required]
    [MaxLength(150)]
    public string CardName { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? CardImageUrl { get; set; }
    
    [MaxLength(50)]
    public string Category { get; set; } = "Standard"; // NoFee, Student, Miles, Points, Commercial
    
    public decimal AnnualFee { get; set; } = 0;
    public bool IsFirstYearFree { get; set; } = false;
    public bool HasWelcomeBonus { get; set; } = false;
    public decimal? WelcomeBonusAmount { get; set; }
    
    // Advantages
    public bool HasAirlineMiles { get; set; } = false;
    public bool HasPoints { get; set; } = false;
    public bool HasCashback { get; set; } = false;
    public bool HasShoppingDiscount { get; set; } = false;
    public bool HasFuelDiscount { get; set; } = false;
    
    [MaxLength(50)]
    public string? MilesProgram { get; set; } // MilesAndSmiles, FlyBoingo, etc.
    
    public decimal? PointsPerTL { get; set; }
    public decimal? MilesPerTL { get; set; }
    public decimal? CashbackRate { get; set; }
    
    [MaxLength(2000)]
    public string? Features { get; set; } // JSON string of features
    
    [MaxLength(1000)]
    public string? Advantages { get; set; } // JSON string of advantages
    
    public bool IsActive { get; set; } = true;
    public bool IsPromoted { get; set; } = false;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public virtual Bank Bank { get; set; } = null!;
}
