using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KredyIo.API.Data;
using KredyIo.API.Models.Entities;

namespace KredyIo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GoldPricesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<GoldPricesController> _logger;

    public GoldPricesController(ApplicationDbContext context, ILogger<GoldPricesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/GoldPrices
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GoldPrice>>> GetGoldPrices()
    {
        return await _context.GoldPrices
            .OrderByDescending(g => g.PriceDate)
            .ToListAsync();
    }

    // GET: api/GoldPrices/5
    [HttpGet("{id}")]
    public async Task<ActionResult<GoldPrice>> GetGoldPrice(int id)
    {
        var price = await _context.GoldPrices.FindAsync(id);
        if (price == null)
            return NotFound();
        return price;
    }

    // GET: api/GoldPrices/latest
    [HttpGet("latest")]
    public async Task<ActionResult<IEnumerable<GoldPrice>>> GetLatestPrices()
    {
        var latestDate = await _context.GoldPrices
            .MaxAsync(g => g.PriceDate);

        return await _context.GoldPrices
            .Where(g => g.PriceDate == latestDate)
            .ToListAsync();
    }

    // POST: api/GoldPrices
    [HttpPost]
    public async Task<ActionResult<GoldPrice>> CreateGoldPrice(GoldPrice price)
    {
        _context.GoldPrices.Add(price);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetGoldPrice), new { id = price.Id }, price);
    }

    // PUT: api/GoldPrices/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateGoldPrice(int id, GoldPrice price)
    {
        if (id != price.Id)
            return BadRequest();
        _context.Entry(price).State = EntityState.Modified;
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.GoldPrices.Any(e => e.Id == id))
                return NotFound();
            else
                throw;
        }
        return NoContent();
    }

    // DELETE: api/GoldPrices/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGoldPrice(int id)
    {
        var price = await _context.GoldPrices.FindAsync(id);
        if (price == null)
            return NotFound();
        _context.GoldPrices.Remove(price);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
