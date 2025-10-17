using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KredyIo.API.Data;
using KredyIo.API.Models.Entities;

namespace KredyIo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FrequentlyAskedQuestionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<FrequentlyAskedQuestionsController> _logger;

    public FrequentlyAskedQuestionsController(ApplicationDbContext context, ILogger<FrequentlyAskedQuestionsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/FrequentlyAskedQuestions
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FrequentlyAskedQuestion>>> GetFrequentlyAskedQuestions(
        [FromQuery] string? category = null,
        [FromQuery] bool? isActive = null)
    {
        var query = _context.FrequentlyAskedQuestions.AsQueryable();

        if (!string.IsNullOrEmpty(category))
            query = query.Where(f => f.Category == category);

        if (isActive.HasValue)
            query = query.Where(f => f.IsActive == isActive.Value);

        return await query
            .OrderBy(f => f.DisplayOrder)
            .ToListAsync();
    }

    // GET: api/FrequentlyAskedQuestions/5
    [HttpGet("{id}")]
    public async Task<ActionResult<FrequentlyAskedQuestion>> GetFrequentlyAskedQuestion(int id)
    {
        var faq = await _context.FrequentlyAskedQuestions.FindAsync(id);
        if (faq == null)
            return NotFound();

        return faq;
    }

    // GET: api/FrequentlyAskedQuestions/categories
    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<string>>> GetCategories()
    {
        return await _context.FrequentlyAskedQuestions
            .Where(f => !string.IsNullOrEmpty(f.Category))
            .Select(f => f.Category)
            .Distinct()
            .ToListAsync();
    }

    // GET: api/FrequentlyAskedQuestions/popular
    [HttpGet("popular")]
    public async Task<ActionResult<IEnumerable<FrequentlyAskedQuestion>>> GetPopularFAQs([FromQuery] int limit = 10)
    {
        return await _context.FrequentlyAskedQuestions
            .Where(f => f.IsActive)
            .OrderBy(f => f.DisplayOrder)
            .Take(limit)
            .ToListAsync();
    }

    // POST: api/FrequentlyAskedQuestions
    [HttpPost]
    public async Task<ActionResult<FrequentlyAskedQuestion>> CreateFrequentlyAskedQuestion(FrequentlyAskedQuestion faq)
    {
        _context.FrequentlyAskedQuestions.Add(faq);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetFrequentlyAskedQuestion), new { id = faq.Id }, faq);
    }

    // PUT: api/FrequentlyAskedQuestions/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateFrequentlyAskedQuestion(int id, FrequentlyAskedQuestion faq)
    {
        if (id != faq.Id)
            return BadRequest();
        _context.Entry(faq).State = EntityState.Modified;
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.FrequentlyAskedQuestions.Any(e => e.Id == id))
                return NotFound();
            else
                throw;
        }
        return NoContent();
    }

    // DELETE: api/FrequentlyAskedQuestions/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFrequentlyAskedQuestion(int id)
    {
        var faq = await _context.FrequentlyAskedQuestions.FindAsync(id);
        if (faq == null)
            return NotFound();
        _context.FrequentlyAskedQuestions.Remove(faq);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
