namespace KredyIo.API.Models.DTOs;

public class LoanProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public string LoanType { get; set; } = string.Empty;
    public decimal MinAmount { get; set; }
    public decimal MaxAmount { get; set; }
    public decimal MinInterestRate { get; set; }
    public decimal MaxInterestRate { get; set; }
    public int MinTerm { get; set; }
    public int MaxTerm { get; set; }
    public int MinAge { get; set; }
    public int MaxAge { get; set; }
    public bool RequiresCollateral { get; set; }
    public bool RequiresGuarantor { get; set; }
    public string? Purpose { get; set; }
    public string? Description { get; set; }
    public List<string>? Features { get; set; }
    public bool IsPromoted { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsFirstHomeLoan { get; set; }
    public bool IsSecondHomeLoan { get; set; }
    public bool IsActive { get; set; }

    // Bank bilgileri
    public BankDto Bank { get; set; } = new();
}

public class BankDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public string? WebsiteUrl { get; set; }
    public decimal? Rating { get; set; }
    public int? CustomerCount { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
}