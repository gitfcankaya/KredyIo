using System.ComponentModel.DataAnnotations;

namespace KredyIo.API.Models.Entities;

public class LoanProduct
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int BankId { get; set; }

    [Required]
    [MaxLength(100)]
    public string ProductName { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Name { get; set; }

    [Required]
    [MaxLength(50)]
    public string LoanType { get; set; } = string.Empty; // PersonalLoan, MortgageLoan, VehicleLoan, etc.

    public decimal MinAmount { get; set; }
    public decimal MaxAmount { get; set; }
    public int MinTerm { get; set; } // months
    public int MaxTerm { get; set; } // months
    public decimal MinInterestRate { get; set; }
    public decimal MaxInterestRate { get; set; }

    [MaxLength(100)]
    public string? Purpose { get; set; }

    public bool RequiresCollateral { get; set; } = false;
    public bool RequiresGuarantor { get; set; } = false;

    public int? MinAge { get; set; }
    public int? MaxAge { get; set; }

    public bool IsActive { get; set; } = true;
    public bool IsPromoted { get; set; } = false;
    public bool IsFeatured { get; set; } = false;
    public bool IsFirstHomeLoan { get; set; } = false; // For mortgage
    public bool IsSecondHomeLoan { get; set; } = false; // For mortgage

    [MaxLength(1000)]
    public string? Description { get; set; }

    [MaxLength(500)]
    public string? Features { get; set; } // JSON string of features

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public virtual Bank Bank { get; set; } = null!;
}
