using System.ComponentModel.DataAnnotations;

namespace KredyIo.API.Models.Entities;

public class FrequentlyAskedQuestion
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty; // PersonalLoan, MortgageLoan, VehicleLoan, CreditCard, Deposit, etc.
    
    [Required]
    [MaxLength(500)]
    public string Question { get; set; } = string.Empty;
    
    [Required]
    public string Answer { get; set; } = string.Empty; // HTML allowed
    
    public int DisplayOrder { get; set; } = 0;
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
