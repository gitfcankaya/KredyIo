using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KredyIo.API.Data;
using KredyIo.API.Models.Entities;

namespace KredyIo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FAQsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<FAQsController> _logger;

    public FAQsController(ApplicationDbContext context, ILogger<FAQsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/FAQs
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FrequentlyAskedQuestion>>> GetFAQs([FromQuery] string? category = null)
    {
        try
        {
            var query = _context.FrequentlyAskedQuestions
                .Where(f => f.IsActive)
                .AsQueryable();

            if (!string.IsNullOrEmpty(category))
                query = query.Where(f => f.Category == category);

            var faqs = await query
                .OrderBy(f => f.Category)
                .ThenBy(f => f.DisplayOrder)
                .ToListAsync();

            return Ok(faqs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching FAQs");
            return StatusCode(500, "An error occurred while fetching FAQs");
        }
    }

    // GET: api/FAQs/5
    [HttpGet("{id}")]
    public async Task<ActionResult<FrequentlyAskedQuestion>> GetFAQ(int id)
    {
        try
        {
            var faq = await _context.FrequentlyAskedQuestions
                .FirstOrDefaultAsync(f => f.Id == id);

            if (faq == null)
            {
                return NotFound();
            }

            return Ok(faq);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching FAQ {Id}", id);
            return StatusCode(500, "An error occurred while fetching the FAQ");
        }
    }

    // GET: api/FAQs/categories
    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<string>>> GetCategories()
    {
        try
        {
            var categories = await _context.FrequentlyAskedQuestions
                .Where(f => f.IsActive)
                .Select(f => f.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();

            return Ok(categories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching FAQ categories");
            return StatusCode(500, "An error occurred while fetching categories");
        }
    }

    // GET: api/FAQs/by-category/{category}
    [HttpGet("by-category/{category}")]
    public async Task<ActionResult<IEnumerable<FrequentlyAskedQuestion>>> GetFAQsByCategory(string category)
    {
        try
        {
            var faqs = await _context.FrequentlyAskedQuestions
                .Where(f => f.IsActive && f.Category == category)
                .OrderBy(f => f.DisplayOrder)
                .ToListAsync();

            return Ok(faqs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching FAQs for category {Category}", category);
            return StatusCode(500, "An error occurred while fetching FAQs for category");
        }
    }

    // GET: api/FAQs/grouped
    [HttpGet("grouped")]
    public async Task<ActionResult<object>> GetFAQsGrouped()
    {
        try
        {
            var faqs = await _context.FrequentlyAskedQuestions
                .Where(f => f.IsActive)
                .OrderBy(f => f.Category)
                .ThenBy(f => f.DisplayOrder)
                .ToListAsync();

            var grouped = faqs
                .GroupBy(f => f.Category)
                .Select(g => new
                {
                    Category = g.Key,
                    Questions = g.Select(f => new
                    {
                        f.Id,
                        f.Question,
                        f.Answer,
                        f.DisplayOrder
                    }).ToList()
                })
                .ToList();

            return Ok(grouped);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching grouped FAQs");
            return StatusCode(500, "An error occurred while fetching grouped FAQs");
        }
    }

    // POST: api/FAQs
    [HttpPost]
    public async Task<ActionResult<FrequentlyAskedQuestion>> CreateFAQ(FrequentlyAskedQuestion faq)
    {
        try
        {
            faq.CreatedAt = DateTime.UtcNow;
            faq.UpdatedAt = DateTime.UtcNow;

            _context.FrequentlyAskedQuestions.Add(faq);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetFAQ), new { id = faq.Id }, faq);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating FAQ");
            return StatusCode(500, "An error occurred while creating the FAQ");
        }
    }

    // PUT: api/FAQs/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateFAQ(int id, FrequentlyAskedQuestion faq)
    {
        if (id != faq.Id)
        {
            return BadRequest();
        }

        try
        {
            faq.UpdatedAt = DateTime.UtcNow;
            _context.Entry(faq).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await FAQExists(id))
            {
                return NotFound();
            }
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating FAQ {Id}", id);
            return StatusCode(500, "An error occurred while updating the FAQ");
        }
    }

    // DELETE: api/FAQs/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFAQ(int id)
    {
        try
        {
            var faq = await _context.FrequentlyAskedQuestions.FindAsync(id);
            if (faq == null)
            {
                return NotFound();
            }

            _context.FrequentlyAskedQuestions.Remove(faq);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting FAQ {Id}", id);
            return StatusCode(500, "An error occurred while deleting the FAQ");
        }
    }

    private async Task<bool> FAQExists(int id)
    {
        return await _context.FrequentlyAskedQuestions.AnyAsync(e => e.Id == id);
    }
}
