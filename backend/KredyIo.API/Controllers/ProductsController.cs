using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KredyIo.API.Data;
using KredyIo.API.Models.DTOs;
using KredyIo.API.Models.Entities;
using System.Text.Json;

namespace KredyIo.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(
        ApplicationDbContext context,
        ILogger<ProductsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<ProductDto>>> GetProducts([FromQuery] ProductFilter filter)
    {
        try
        {
            var query = _context.Products.Where(p => p.IsActive);

            // Apply filters
            if (filter.Type.HasValue)
                query = query.Where(p => p.Type == filter.Type.Value);

            if (!string.IsNullOrWhiteSpace(filter.LenderName))
                query = query.Where(p => p.LenderName.Contains(filter.LenderName));

            if (filter.MinRate.HasValue)
                query = query.Where(p => p.InterestRate >= filter.MinRate.Value);

            if (filter.MaxRate.HasValue)
                query = query.Where(p => p.InterestRate <= filter.MaxRate.Value);

            if (filter.Amount.HasValue)
                query = query.Where(p => p.MinAmount <= filter.Amount.Value && p.MaxAmount >= filter.Amount.Value);

            if (filter.Term.HasValue)
                query = query.Where(p => p.MinTerm <= filter.Term.Value && p.MaxTerm >= filter.Term.Value);

            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
                query = query.Where(p => p.ProductName.Contains(filter.SearchTerm) || p.LenderName.Contains(filter.SearchTerm));

            // Apply sorting
            query = filter.SortBy?.ToLower() switch
            {
                "rate" => filter.SortDescending ? query.OrderByDescending(p => p.InterestRate) : query.OrderBy(p => p.InterestRate),
                "name" => filter.SortDescending ? query.OrderByDescending(p => p.ProductName) : query.OrderBy(p => p.ProductName),
                "lender" => filter.SortDescending ? query.OrderByDescending(p => p.LenderName) : query.OrderBy(p => p.LenderName),
                _ => query.OrderBy(p => p.InterestRate)
            };

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var productDtos = items.Select(MapToDto).ToList();

            var result = new PagedResult<ProductDto>
            {
                Items = productDtos,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };

            return Ok(new { success = true, data = result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting products");
            return StatusCode(500, new { success = false, error = new { message = "An error occurred" } });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetProduct(Guid id)
    {
        try
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
                return NotFound(new { success = false, error = new { message = "Product not found" } });

            return Ok(new { success = true, data = MapToDto(product) });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting product");
            return StatusCode(500, new { success = false, error = new { message = "An error occurred" } });
        }
    }

    [HttpGet("compare")]
    public async Task<ActionResult<List<ProductDto>>> CompareProducts([FromQuery] string ids)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(ids))
                return BadRequest(new { success = false, error = new { message = "Product IDs are required" } });

            var productIds = ids.Split(',')
                .Select(id => Guid.TryParse(id.Trim(), out var guid) ? guid : Guid.Empty)
                .Where(id => id != Guid.Empty)
                .ToList();

            if (productIds.Count == 0)
                return BadRequest(new { success = false, error = new { message = "Invalid product IDs" } });

            if (productIds.Count > 5)
                return BadRequest(new { success = false, error = new { message = "Maximum 5 products can be compared" } });

            var products = await _context.Products
                .Where(p => productIds.Contains(p.Id) && p.IsActive)
                .ToListAsync();

            var productDtos = products.Select(MapToDto).ToList();

            return Ok(new { success = true, data = productDtos });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error comparing products");
            return StatusCode(500, new { success = false, error = new { message = "An error occurred" } });
        }
    }

    private static ProductDto MapToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Type = product.Type,
            LenderName = product.LenderName,
            ProductName = product.ProductName,
            InterestRate = product.InterestRate,
            InterestType = product.InterestType,
            MinAmount = product.MinAmount,
            MaxAmount = product.MaxAmount,
            MinTerm = product.MinTerm,
            MaxTerm = product.MaxTerm,
            Fees = string.IsNullOrWhiteSpace(product.Fees) ? null : JsonSerializer.Deserialize<List<string>>(product.Fees),
            Features = string.IsNullOrWhiteSpace(product.Features) ? null : JsonSerializer.Deserialize<List<string>>(product.Features),
            Eligibility = string.IsNullOrWhiteSpace(product.Eligibility) ? null : JsonSerializer.Deserialize<List<string>>(product.Eligibility),
            Description = product.Description,
            ImageUrl = product.ImageUrl
        };
    }
}
