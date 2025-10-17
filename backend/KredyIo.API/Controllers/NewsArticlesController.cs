using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KredyIo.API.Data;
using KredyIo.API.Models.Entities;

namespace KredyIo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NewsArticlesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<NewsArticlesController> _logger;

    public NewsArticlesController(ApplicationDbContext context, ILogger<NewsArticlesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/NewsArticles
    [HttpGet]
    public async Task<ActionResult<IEnumerable<NewsArticle>>> GetNewsArticles(
        [FromQuery] string? category = null,
        [FromQuery] string? source = null,
        [FromQuery] bool? isActive = null)
    {
        var query = _context.NewsArticles.AsQueryable();

        if (!string.IsNullOrEmpty(category))
            query = query.Where(n => n.Category == category);

        if (!string.IsNullOrEmpty(source))
            query = query.Where(n => n.Source == source);

        if (isActive.HasValue)
            query = query.Where(n => n.IsActive == isActive.Value);

        return await query
            .OrderByDescending(n => n.PublishedAt)
            .ToListAsync();
    }

    // GET: api/NewsArticles/5
    [HttpGet("{id}")]
    public async Task<ActionResult<NewsArticle>> GetNewsArticle(int id)
    {
        var article = await _context.NewsArticles.FindAsync(id);
        if (article == null)
            return NotFound();

        // Increment view count
        article.ViewCount++;
        await _context.SaveChangesAsync();

        return article;
    }

    // GET: api/NewsArticles/latest
    [HttpGet("latest")]
    public async Task<ActionResult<IEnumerable<NewsArticle>>> GetLatestNews([FromQuery] int limit = 10)
    {
        return await _context.NewsArticles
            .Where(n => n.IsActive)
            .OrderByDescending(n => n.PublishedAt)
            .Take(limit)
            .ToListAsync();
    }

    // GET: api/NewsArticles/popular
    [HttpGet("popular")]
    public async Task<ActionResult<IEnumerable<NewsArticle>>> GetPopularNews([FromQuery] int limit = 10)
    {
        return await _context.NewsArticles
            .Where(n => n.IsActive)
            .OrderByDescending(n => n.ViewCount)
            .Take(limit)
            .ToListAsync();
    }

    // POST: api/NewsArticles
    [HttpPost]
    public async Task<ActionResult<NewsArticle>> CreateNewsArticle(NewsArticle article)
    {
        _context.NewsArticles.Add(article);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetNewsArticle), new { id = article.Id }, article);
    }

    // PUT: api/NewsArticles/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateNewsArticle(int id, NewsArticle article)
    {
        if (id != article.Id)
            return BadRequest();
        _context.Entry(article).State = EntityState.Modified;
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.NewsArticles.Any(e => e.Id == id))
                return NotFound();
            else
                throw;
        }
        return NoContent();
    }

    // DELETE: api/NewsArticles/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNewsArticle(int id)
    {
        var article = await _context.NewsArticles.FindAsync(id);
        if (article == null)
            return NotFound();
        _context.NewsArticles.Remove(article);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
