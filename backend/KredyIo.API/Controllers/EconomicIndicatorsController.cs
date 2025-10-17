using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KredyIo.API.Data;
using KredyIo.API.Models.Entities;

namespace KredyIo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EconomicIndicatorsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<EconomicIndicatorsController> _logger;

    public EconomicIndicatorsController(ApplicationDbContext context, ILogger<EconomicIndicatorsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/EconomicIndicators
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EconomicIndicator>>> GetEconomicIndicators()
    {
        return await _context.EconomicIndicators
            .OrderByDescending(e => e.DataDate)
            .ToListAsync();
    }

    // GET: api/EconomicIndicators/5
    [HttpGet("{id}")]
    public async Task<ActionResult<EconomicIndicator>> GetEconomicIndicator(int id)
    {
        var indicator = await _context.EconomicIndicators.FindAsync(id);
        if (indicator == null)
            return NotFound();
        return indicator;
    }

    // GET: api/EconomicIndicators/code/{code}
    [HttpGet("code/{code}")]
    public async Task<ActionResult<EconomicIndicator>> GetEconomicIndicatorByCode(string code)
    {
        var indicator = await _context.EconomicIndicators
            .Where(e => e.IndicatorCode == code)
            .OrderByDescending(e => e.DataDate)
            .FirstOrDefaultAsync();

        if (indicator == null)
            return NotFound();
        return indicator;
    }

    // GET: api/EconomicIndicators/latest
    [HttpGet("latest")]
    public async Task<ActionResult<IEnumerable<EconomicIndicator>>> GetLatestIndicators()
    {
        var latestDate = await _context.EconomicIndicators
            .MaxAsync(e => e.DataDate);

        return await _context.EconomicIndicators
            .Where(e => e.DataDate == latestDate)
            .ToListAsync();
    }

    // POST: api/EconomicIndicators
    [HttpPost]
    public async Task<ActionResult<EconomicIndicator>> CreateEconomicIndicator(EconomicIndicator indicator)
    {
        _context.EconomicIndicators.Add(indicator);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetEconomicIndicator), new { id = indicator.Id }, indicator);
    }

    // PUT: api/EconomicIndicators/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEconomicIndicator(int id, EconomicIndicator indicator)
    {
        if (id != indicator.Id)
            return BadRequest();
        _context.Entry(indicator).State = EntityState.Modified;
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.EconomicIndicators.Any(e => e.Id == id))
                return NotFound();
            else
                throw;
        }
        return NoContent();
    }

    // DELETE: api/EconomicIndicators/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEconomicIndicator(int id)
    {
        var indicator = await _context.EconomicIndicators.FindAsync(id);
        if (indicator == null)
            return NotFound();
        _context.EconomicIndicators.Remove(indicator);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
