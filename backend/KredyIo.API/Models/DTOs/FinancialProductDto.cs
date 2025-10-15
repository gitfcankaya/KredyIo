namespace KredyIo.API.Models.DTOs;

public class CreditCardProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? CardNetwork { get; set; }
    public string? CardType { get; set; }
    public decimal AnnualFee { get; set; }
    public decimal? CashbackRate { get; set; }
    public decimal? PointsPerTL { get; set; }
    public decimal? MilesPerTL { get; set; }
    public decimal MinCreditLimit { get; set; }
    public decimal MaxCreditLimit { get; set; }
    public decimal? AnnualSpendRequirement { get; set; }
    public decimal? WelcomeBonusAmount { get; set; }
    public string? WelcomeBonusConditions { get; set; }
    public string? Features { get; set; }
    public string? Benefits { get; set; }
    public string? Eligibility { get; set; }
    public string? Description { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; }

    // Bank bilgileri
    public BankDto Bank { get; set; } = new();
}

public class CampaignDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string CampaignType { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal? DiscountRate { get; set; }
    public decimal? BonusAmount { get; set; }
    public string? Conditions { get; set; }
    public string? Terms { get; set; }
    public string? TargetAudience { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsActive { get; set; }
    public bool IsFeatured { get; set; }

    // Bank bilgileri
    public BankDto Bank { get; set; } = new();
}

public class DepositRateDto
{
    public int Id { get; set; }
    public int BankId { get; set; }
    public string Currency { get; set; } = string.Empty;
    public int TermMonths { get; set; }
    public decimal InterestRate { get; set; }
    public decimal? CampaignRate { get; set; }
    public DateTime? CampaignEndDate { get; set; }
    public decimal MinAmount { get; set; }
    public decimal MaxAmount { get; set; }
    public bool HasCampaign { get; set; }
    public string? CampaignDetails { get; set; }
    public bool IsActive { get; set; }
    public DateTime EffectiveDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Bank bilgileri
    public BankDto Bank { get; set; } = new();
}