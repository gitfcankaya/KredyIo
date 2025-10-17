using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KredyIo.API.Data;
using KredyIo.API.Models.Entities;

namespace KredyIo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepositProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DepositProductsController> _logger;

    public DepositProductsController(ApplicationDbContext context, ILogger<DepositProductsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/DepositProducts
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DepositProduct>>> GetDepositProducts()
    {
        return await _context.DepositProducts.ToListAsync();
    }

    // GET: api/DepositProducts/5
    [HttpGet("{id}")]
    public async Task<ActionResult<DepositProduct>> GetDepositProduct(int id)
    {
        var product = await _context.DepositProducts.FindAsync(id);
        if (product == null)
            return NotFound();
        return product;
    }

    // POST: api/DepositProducts
    [HttpPost]
    public async Task<ActionResult<DepositProduct>> CreateDepositProduct(DepositProduct product)
    {
        _context.DepositProducts.Add(product);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetDepositProduct), new { id = product.Id }, product);
    }

    // PUT: api/DepositProducts/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDepositProduct(int id, DepositProduct product)
    {
        if (id != product.Id)
            return BadRequest();
        _context.Entry(product).State = EntityState.Modified;
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.DepositProducts.Any(e => e.Id == id))
                return NotFound();
            else
                throw;
        }
        return NoContent();
    }

    // DELETE: api/DepositProducts/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDepositProduct(int id)
    {
        var product = await _context.DepositProducts.FindAsync(id);
        if (product == null)
            return NotFound();
        _context.DepositProducts.Remove(product);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
