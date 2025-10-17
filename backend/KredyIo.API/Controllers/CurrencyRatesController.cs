using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KredyIo.API.Data;
using KredyIo.API.Models.Entities;

namespace KredyIo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CurrencyRatesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<CurrencyRatesController> _logger;

    public CurrencyRatesController(ApplicationDbContext context, ILogger<CurrencyRatesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/CurrencyRates
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CurrencyRate>>> GetCurrencyRates()
    {
        return await _context.CurrencyRates
            .OrderByDescending(c => c.RateDate)
            .ToListAsync();
    }

    // GET: api/CurrencyRates/5
    [HttpGet("{id}")]
    public async Task<ActionResult<CurrencyRate>> GetCurrencyRate(int id)
    {
        var rate = await _context.CurrencyRates.FindAsync(id);
        if (rate == null)
            return NotFound();
        return rate;
    }

    // GET: api/CurrencyRates/latest
    [HttpGet("latest")]
    public async Task<ActionResult<IEnumerable<CurrencyRate>>> GetLatestRates()
    {
        var latestDate = await _context.CurrencyRates
            .MaxAsync(c => c.RateDate);

        return await _context.CurrencyRates
            .Where(c => c.RateDate == latestDate)
            .ToListAsync();
    }

    // POST: api/CurrencyRates
    [HttpPost]
    public async Task<ActionResult<CurrencyRate>> CreateCurrencyRate(CurrencyRate rate)
    {
        _context.CurrencyRates.Add(rate);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCurrencyRate), new { id = rate.Id }, rate);
    }

    // PUT: api/CurrencyRates/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCurrencyRate(int id, CurrencyRate rate)
    {
        if (id != rate.Id)
            return BadRequest();
        _context.Entry(rate).State = EntityState.Modified;
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.CurrencyRates.Any(e => e.Id == id))
                return NotFound();
            else
                throw;
        }
        return NoContent();
    }

    // DELETE: api/CurrencyRates/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCurrencyRate(int id)
    {
        var rate = await _context.CurrencyRates.FindAsync(id);
        if (rate == null)
            return NotFound();
        _context.CurrencyRates.Remove(rate);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
