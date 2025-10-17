using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KredyIo.API.Data;
using KredyIo.API.Models.Entities;

namespace KredyIo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InvestmentProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<InvestmentProductsController> _logger;

    public InvestmentProductsController(ApplicationDbContext context, ILogger<InvestmentProductsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/InvestmentProducts
    [HttpGet]
    public async Task<ActionResult<IEnumerable<InvestmentProduct>>> GetInvestmentProducts()
    {
        return await _context.InvestmentProducts.ToListAsync();
    }

    // GET: api/InvestmentProducts/5
    [HttpGet("{id}")]
    public async Task<ActionResult<InvestmentProduct>> GetInvestmentProduct(int id)
    {
        var product = await _context.InvestmentProducts.FindAsync(id);
        if (product == null)
            return NotFound();
        return product;
    }

    // POST: api/InvestmentProducts
    [HttpPost]
    public async Task<ActionResult<InvestmentProduct>> CreateInvestmentProduct(InvestmentProduct product)
    {
        _context.InvestmentProducts.Add(product);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetInvestmentProduct), new { id = product.Id }, product);
    }

    // PUT: api/InvestmentProducts/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateInvestmentProduct(int id, InvestmentProduct product)
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
            if (!_context.InvestmentProducts.Any(e => e.Id == id))
                return NotFound();
            else
                throw;
        }
        return NoContent();
    }

    // DELETE: api/InvestmentProducts/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInvestmentProduct(int id)
    {
        var product = await _context.InvestmentProducts.FindAsync(id);
        if (product == null)
            return NotFound();
        _context.InvestmentProducts.Remove(product);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
