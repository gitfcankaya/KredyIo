using KredyIo.API.Models.Entities;

namespace KredyIo.API.Models.DTOs;

public class ProductDto
{
    public Guid Id { get; set; }
    public ProductType Type { get; set; }
    public string LenderName { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public decimal InterestRate { get; set; }
    public InterestType InterestType { get; set; }
    public decimal MinAmount { get; set; }
    public decimal MaxAmount { get; set; }
    public int MinTerm { get; set; }
    public int MaxTerm { get; set; }
    public List<string>? Fees { get; set; }
    public List<string>? Features { get; set; }
    public List<string>? Eligibility { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
}

public class CreateProductDto
{
    public ProductType Type { get; set; }
    public string LenderName { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public decimal InterestRate { get; set; }
    public InterestType InterestType { get; set; }
    public decimal MinAmount { get; set; }
    public decimal MaxAmount { get; set; }
    public int MinTerm { get; set; }
    public int MaxTerm { get; set; }
    public List<string>? Fees { get; set; }
    public List<string>? Features { get; set; }
    public List<string>? Eligibility { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
}

public class UpdateProductDto : CreateProductDto
{
    public bool IsActive { get; set; }
}

public class ProductFilter
{
    public ProductType? Type { get; set; }
    public string? LenderName { get; set; }
    public decimal? MinRate { get; set; }
    public decimal? MaxRate { get; set; }
    public decimal? Amount { get; set; }
    public int? Term { get; set; }
    public string? SearchTerm { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; }
}

public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}
