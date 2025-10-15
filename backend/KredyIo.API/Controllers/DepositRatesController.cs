using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KredyIo.API.Data;
using KredyIo.API.Models.Entities;

namespace KredyIo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepositRatesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DepositRatesController> _logger;

    public DepositRatesController(ApplicationDbContext context, ILogger<DepositRatesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/DepositRates
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DepositRate>>> GetDepositRates(
        [FromQuery] string? currency = null,
        [FromQuery] int? termMonths = null,
        [FromQuery] int? bankId = null,
        [FromQuery] bool? hasCampaign = null)
    {
        try
        {
            var query = _context.DepositRates
                .Include(dr => dr.Bank)
                .Where(dr => dr.IsActive)
                .AsQueryable();

            if (!string.IsNullOrEmpty(currency))
                query = query.Where(dr => dr.Currency == currency);

            if (termMonths.HasValue)
                query = query.Where(dr => dr.TermMonths == termMonths.Value);

            if (bankId.HasValue)
                query = query.Where(dr => dr.BankId == bankId.Value);

            if (hasCampaign.HasValue)
                query = query.Where(dr => dr.HasCampaign == hasCampaign.Value);

            var rates = await query
                .OrderByDescending(dr => dr.InterestRate)
                .ToListAsync();

            return Ok(rates);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching deposit rates");
            return StatusCode(500, "An error occurred while fetching deposit rates");
        }
    }

    // GET: api/DepositRates/5
    [HttpGet("{id}")]
    public async Task<ActionResult<DepositRate>> GetDepositRate(int id)
    {
        try
        {
            var rate = await _context.DepositRates
                .Include(dr => dr.Bank)
                .FirstOrDefaultAsync(dr => dr.Id == id);

            if (rate == null)
            {
                return NotFound();
            }

            return Ok(rate);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching deposit rate {Id}", id);
            return StatusCode(500, "An error occurred while fetching the deposit rate");
        }
    }

    // GET: api/DepositRates/matrix
    [HttpGet("matrix")]
    public async Task<ActionResult<object>> GetRatesMatrix([FromQuery] string currency = "TRY")
    {
        try
        {
            var rates = await _context.DepositRates
                .Include(dr => dr.Bank)
                .Where(dr => dr.IsActive && dr.Currency == currency)
                .OrderBy(dr => dr.Bank.Name)
                .ThenBy(dr => dr.TermMonths)
                .ToListAsync();

            var matrix = rates
                .GroupBy(r => r.Bank.Name)
                .Select(g => new
                {
                    BankName = g.Key,
                    Rates = g.Select(r => new
                    {
                        r.TermMonths,
                        r.InterestRate,
                        r.HasCampaign,
                        r.CampaignDetails
                    }).ToList()
                })
                .ToList();

            return Ok(matrix);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching rates matrix");
            return StatusCode(500, "An error occurred while fetching rates matrix");
        }
    }

    // GET: api/DepositRates/best-rates
    [HttpGet("best-rates")]
    public async Task<ActionResult<object>> GetBestRates()
    {
        try
        {
            var currencies = new[] { "TRY", "USD", "EUR", "GBP" };
            var terms = new[] { 1, 3, 6, 12 };

            var bestRates = new Dictionary<string, object>();

            foreach (var currency in currencies)
            {
                var currencyRates = new Dictionary<string, object>();
                
                foreach (var term in terms)
                {
                    var topRate = await _context.DepositRates
                        .Include(dr => dr.Bank)
                        .Where(dr => dr.IsActive && dr.Currency == currency && dr.TermMonths == term)
                        .OrderByDescending(dr => dr.InterestRate)
                        .FirstOrDefaultAsync();

                    if (topRate != null)
                    {
                        currencyRates[$"{term}Month"] = new
                        {
                            topRate.BankId,
                            BankName = topRate.Bank.Name,
                            topRate.InterestRate,
                            topRate.HasCampaign,
                            topRate.CampaignDetails
                        };
                    }
                }

                bestRates[currency] = currencyRates;
            }

            return Ok(bestRates);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching best rates");
            return StatusCode(500, "An error occurred while fetching best rates");
        }
    }

    // GET: api/DepositRates/campaigns
    [HttpGet("campaigns")]
    public async Task<ActionResult<IEnumerable<DepositRate>>> GetCampaignRates()
    {
        try
        {
            var rates = await _context.DepositRates
                .Include(dr => dr.Bank)
                .Where(dr => dr.IsActive && dr.HasCampaign)
                .OrderByDescending(dr => dr.InterestRate)
                .ToListAsync();

            return Ok(rates);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching campaign rates");
            return StatusCode(500, "An error occurred while fetching campaign rates");
        }
    }

    // POST: api/DepositRates
    [HttpPost]
    public async Task<ActionResult<DepositRate>> CreateDepositRate(DepositRate rate)
    {
        try
        {
            rate.CreatedAt = DateTime.UtcNow;
            rate.UpdatedAt = DateTime.UtcNow;
            rate.EffectiveDate = DateTime.UtcNow;

            _context.DepositRates.Add(rate);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDepositRate), new { id = rate.Id }, rate);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating deposit rate");
            return StatusCode(500, "An error occurred while creating the deposit rate");
        }
    }

    // PUT: api/DepositRates/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDepositRate(int id, DepositRate rate)
    {
        if (id != rate.Id)
        {
            return BadRequest();
        }

        try
        {
            rate.UpdatedAt = DateTime.UtcNow;
            _context.Entry(rate).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await DepositRateExists(id))
            {
                return NotFound();
            }
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating deposit rate {Id}", id);
            return StatusCode(500, "An error occurred while updating the deposit rate");
        }
    }

    // DELETE: api/DepositRates/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDepositRate(int id)
    {
        try
        {
            var rate = await _context.DepositRates.FindAsync(id);
            if (rate == null)
            {
                return NotFound();
            }

            _context.DepositRates.Remove(rate);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting deposit rate {Id}", id);
            return StatusCode(500, "An error occurred while deleting the deposit rate");
        }
    }

    private async Task<bool> DepositRateExists(int id)
    {
        return await _context.DepositRates.AnyAsync(e => e.Id == id);
    }
}
