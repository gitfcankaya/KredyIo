using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KredyIo.API.Data;
using KredyIo.API.Models.Entities;

namespace KredyIo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoanProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<LoanProductsController> _logger;

    public LoanProductsController(ApplicationDbContext context, ILogger<LoanProductsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/LoanProducts
    [HttpGet]
    public async Task<ActionResult<IEnumerable<LoanProduct>>> GetLoanProducts(
        [FromQuery] string? loanType = null,
        [FromQuery] int? bankId = null,
        [FromQuery] decimal? minAmount = null,
        [FromQuery] decimal? maxAmount = null,
        [FromQuery] decimal? maxInterestRate = null,
        [FromQuery] bool? isPromoted = null,
        [FromQuery] bool? isFirstHomeLoan = null)
    {
        try
        {
            var query = _context.LoanProducts
                .Include(lp => lp.Bank)
                .Where(lp => lp.IsActive)
                .AsQueryable();

            if (!string.IsNullOrEmpty(loanType))
                query = query.Where(lp => lp.LoanType == loanType);

            if (bankId.HasValue)
                query = query.Where(lp => lp.BankId == bankId.Value);

            if (minAmount.HasValue)
                query = query.Where(lp => lp.MaxAmount >= minAmount.Value);

            if (maxAmount.HasValue)
                query = query.Where(lp => lp.MinAmount <= maxAmount.Value);

            if (maxInterestRate.HasValue)
                query = query.Where(lp => lp.MinInterestRate <= maxInterestRate.Value);

            if (isPromoted.HasValue)
                query = query.Where(lp => lp.IsPromoted == isPromoted.Value);

            if (isFirstHomeLoan.HasValue)
                query = query.Where(lp => lp.IsFirstHomeLoan == isFirstHomeLoan.Value);

            var products = await query
                .OrderBy(lp => lp.MinInterestRate)
                .ToListAsync();

            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching loan products");
            return StatusCode(500, "An error occurred while fetching loan products");
        }
    }

    // GET: api/LoanProducts/5
    [HttpGet("{id}")]
    public async Task<ActionResult<LoanProduct>> GetLoanProduct(int id)
    {
        try
        {
            var loanProduct = await _context.LoanProducts
                .Include(lp => lp.Bank)
                .FirstOrDefaultAsync(lp => lp.Id == id);

            if (loanProduct == null)
            {
                return NotFound();
            }

            return Ok(loanProduct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching loan product {Id}", id);
            return StatusCode(500, "An error occurred while fetching the loan product");
        }
    }

    // GET: api/LoanProducts/types
    [HttpGet("types")]
    public ActionResult<IEnumerable<string>> GetLoanTypes()
    {
        return Ok(new[] { "PersonalLoan", "MortgageLoan", "VehicleLoan" });
    }

    // GET: api/LoanProducts/promoted
    [HttpGet("promoted")]
    public async Task<ActionResult<IEnumerable<LoanProduct>>> GetPromotedLoanProducts([FromQuery] int limit = 10)
    {
        try
        {
            var products = await _context.LoanProducts
                .Include(lp => lp.Bank)
                .Where(lp => lp.IsActive && lp.IsPromoted)
                .OrderBy(lp => lp.MinInterestRate)
                .Take(limit)
                .ToListAsync();

            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching promoted loan products");
            return StatusCode(500, "An error occurred while fetching promoted loan products");
        }
    }

    // GET: api/LoanProducts/best-rates
    [HttpGet("best-rates")]
    public async Task<ActionResult<object>> GetBestRates()
    {
        try
        {
            var bestRates = new
            {
                PersonalLoan = await _context.LoanProducts
                    .Include(lp => lp.Bank)
                    .Where(lp => lp.IsActive && lp.LoanType == "PersonalLoan")
                    .OrderBy(lp => lp.MinInterestRate)
                    .Take(3)
                    .ToListAsync(),
                
                MortgageLoan = await _context.LoanProducts
                    .Include(lp => lp.Bank)
                    .Where(lp => lp.IsActive && lp.LoanType == "MortgageLoan")
                    .OrderBy(lp => lp.MinInterestRate)
                    .Take(3)
                    .ToListAsync(),
                
                VehicleLoan = await _context.LoanProducts
                    .Include(lp => lp.Bank)
                    .Where(lp => lp.IsActive && lp.LoanType == "VehicleLoan")
                    .OrderBy(lp => lp.MinInterestRate)
                    .Take(3)
                    .ToListAsync()
            };

            return Ok(bestRates);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching best rates");
            return StatusCode(500, "An error occurred while fetching best rates");
        }
    }

    // POST: api/LoanProducts
    [HttpPost]
    public async Task<ActionResult<LoanProduct>> CreateLoanProduct(LoanProduct loanProduct)
    {
        try
        {
            loanProduct.CreatedAt = DateTime.UtcNow;
            loanProduct.UpdatedAt = DateTime.UtcNow;

            _context.LoanProducts.Add(loanProduct);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLoanProduct), new { id = loanProduct.Id }, loanProduct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating loan product");
            return StatusCode(500, "An error occurred while creating the loan product");
        }
    }

    // PUT: api/LoanProducts/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateLoanProduct(int id, LoanProduct loanProduct)
    {
        if (id != loanProduct.Id)
        {
            return BadRequest();
        }

        try
        {
            loanProduct.UpdatedAt = DateTime.UtcNow;
            _context.Entry(loanProduct).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await LoanProductExists(id))
            {
                return NotFound();
            }
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating loan product {Id}", id);
            return StatusCode(500, "An error occurred while updating the loan product");
        }
    }

    // DELETE: api/LoanProducts/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLoanProduct(int id)
    {
        try
        {
            var loanProduct = await _context.LoanProducts.FindAsync(id);
            if (loanProduct == null)
            {
                return NotFound();
            }

            _context.LoanProducts.Remove(loanProduct);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting loan product {Id}", id);
            return StatusCode(500, "An error occurred while deleting the loan product");
        }
    }

    private async Task<bool> LoanProductExists(int id)
    {
        return await _context.LoanProducts.AnyAsync(e => e.Id == id);
    }
}
