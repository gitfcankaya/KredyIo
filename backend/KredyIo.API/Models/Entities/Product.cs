using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KredyIo.API.Models.Entities;

public enum ProductType
{
    PersonalLoan = 1,
    CreditCard = 2,
    Mortgage = 3,
    AutoLoan = 4,
    BusinessLoan = 5
}

public enum InterestType
{
    Fixed = 1,
    Variable = 2
}

public class Product
{
    public Guid Id { get; set; }
    public ProductType Type { get; set; }
    
    // Bank relationship
    public int? BankId { get; set; }
    
    public string LenderName { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    
    [Column(TypeName = "decimal(18,4)")]
    public decimal InterestRate { get; set; }
    
    public InterestType InterestType { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal MinAmount { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal MaxAmount { get; set; }
    
    public int MinTerm { get; set; }
    public int MaxTerm { get; set; }
    public string? Fees { get; set; }
    public string? Features { get; set; }
    public string? Eligibility { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsActive { get; set; }
    
    // Navigation Properties
    [ForeignKey("BankId")]
    public virtual Bank? Bank { get; set; }
}
