using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KredyIo.API.Data;
using KredyIo.API.Models.Entities;
using KredyIo.API.Models.DTOs;

namespace KredyIo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CreditCardProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<CreditCardProductsController> _logger;

    public CreditCardProductsController(ApplicationDbContext context, ILogger<CreditCardProductsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/CreditCardProducts
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CreditCardProductDto>>> GetCreditCardProducts(
        [FromQuery] string? category = null,
        [FromQuery] int? bankId = null,
        [FromQuery] bool? isPromoted = null,
        [FromQuery] bool? noFee = null,
        [FromQuery] bool? hasAirlineMiles = null,
        [FromQuery] bool? hasPoints = null,
        [FromQuery] bool? hasCashback = null)
    {
        try
        {
            var query = _context.CreditCardProducts
                .Include(cc => cc.Bank)
                .Where(cc => cc.IsActive)
                .AsQueryable();

            if (!string.IsNullOrEmpty(category))
                query = query.Where(cc => cc.Category == category);

            if (bankId.HasValue)
                query = query.Where(cc => cc.BankId == bankId.Value);

            if (isPromoted.HasValue)
                query = query.Where(cc => cc.IsPromoted == isPromoted.Value);

            if (noFee.HasValue && noFee.Value)
                query = query.Where(cc => cc.AnnualFee == 0);

            if (hasAirlineMiles.HasValue)
                query = query.Where(cc => cc.HasAirlineMiles == hasAirlineMiles.Value);

            if (hasPoints.HasValue)
                query = query.Where(cc => cc.HasPoints == hasPoints.Value);

            if (hasCashback.HasValue)
                query = query.Where(cc => cc.HasCashback == hasCashback.Value);

            var products = await query
                .OrderBy(cc => cc.AnnualFee)
                .ThenByDescending(cc => cc.IsPromoted)
                .ToListAsync();

            var productDtos = products.Select(p => new CreditCardProductDto
            {
                Id = p.Id,
                Name = p.CardName ?? "",
                CardNetwork = p.Category,
                CardType = p.Category,
                AnnualFee = p.AnnualFee,
                CashbackRate = p.CashbackRate,
                PointsPerTL = p.PointsPerTL,
                MilesPerTL = p.MilesPerTL,
                MinCreditLimit = 0,
                MaxCreditLimit = 0,
                AnnualSpendRequirement = 0,
                WelcomeBonusAmount = p.WelcomeBonusAmount,
                WelcomeBonusConditions = "",
                Features = p.Features,
                Benefits = p.Advantages,
                Eligibility = p.Advantages,
                Description = p.Features,
                IsFeatured = p.IsPromoted,
                IsActive = p.IsActive,
                Bank = new BankDto
                {
                    Id = p.Bank.Id,
                    Name = p.Bank.Name,
                    Code = p.Bank.Code,
                    LogoUrl = p.Bank.LogoUrl,
                    WebsiteUrl = p.Bank.WebsiteUrl,
                    Rating = p.Bank.Rating,
                    CustomerCount = p.Bank.CustomerCount,
                    Description = p.Bank.Description,
                    IsActive = p.Bank.IsActive
                }
            }).ToList();

            return Ok(productDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching credit card products");
            return StatusCode(500, "An error occurred while fetching credit card products");
        }
    }

    // GET: api/CreditCardProducts/5
    [HttpGet("{id}")]
    public async Task<ActionResult<CreditCardProduct>> GetCreditCardProduct(int id)
    {
        try
        {
            var product = await _context.CreditCardProducts
                .Include(cc => cc.Bank)
                .FirstOrDefaultAsync(cc => cc.Id == id);

            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching credit card product {Id}", id);
            return StatusCode(500, "An error occurred while fetching the credit card product");
        }
    }

    // GET: api/CreditCardProducts/categories
    [HttpGet("categories")]
    public ActionResult<IEnumerable<string>> GetCategories()
    {
        return Ok(new[] { "NoFee", "Student", "Miles", "Points", "Commercial" });
    }

    // GET: api/CreditCardProducts/promoted
    [HttpGet("promoted")]
    public async Task<ActionResult<IEnumerable<CreditCardProduct>>> GetPromotedProducts([FromQuery] int limit = 10)
    {
        try
        {
            var products = await _context.CreditCardProducts
                .Include(cc => cc.Bank)
                .Where(cc => cc.IsActive && cc.IsPromoted)
                .OrderBy(cc => cc.AnnualFee)
                .Take(limit)
                .ToListAsync();

            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching promoted credit card products");
            return StatusCode(500, "An error occurred while fetching promoted products");
        }
    }

    // GET: api/CreditCardProducts/no-fee
    [HttpGet("no-fee")]
    public async Task<ActionResult<IEnumerable<CreditCardProduct>>> GetNoFeeCards()
    {
        try
        {
            var products = await _context.CreditCardProducts
                .Include(cc => cc.Bank)
                .Where(cc => cc.IsActive && cc.AnnualFee == 0)
                .OrderByDescending(cc => cc.IsPromoted)
                .ToListAsync();

            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching no-fee credit cards");
            return StatusCode(500, "An error occurred while fetching no-fee cards");
        }
    }

    // POST: api/CreditCardProducts
    [HttpPost]
    public async Task<ActionResult<CreditCardProduct>> CreateCreditCardProduct(CreditCardProduct product)
    {
        try
        {
            product.CreatedAt = DateTime.UtcNow;
            product.UpdatedAt = DateTime.UtcNow;

            _context.CreditCardProducts.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCreditCardProduct), new { id = product.Id }, product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating credit card product");
            return StatusCode(500, "An error occurred while creating the product");
        }
    }

    // PUT: api/CreditCardProducts/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCreditCardProduct(int id, CreditCardProduct product)
    {
        if (id != product.Id)
        {
            return BadRequest();
        }

        try
        {
            product.UpdatedAt = DateTime.UtcNow;
            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await CreditCardProductExists(id))
            {
                return NotFound();
            }
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating credit card product {Id}", id);
            return StatusCode(500, "An error occurred while updating the product");
        }
    }

    // DELETE: api/CreditCardProducts/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCreditCardProduct(int id)
    {
        try
        {
            var product = await _context.CreditCardProducts.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.CreditCardProducts.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting credit card product {Id}", id);
            return StatusCode(500, "An error occurred while deleting the product");
        }
    }

    private async Task<bool> CreditCardProductExists(int id)
    {
        return await _context.CreditCardProducts.AnyAsync(e => e.Id == id);
    }
}
