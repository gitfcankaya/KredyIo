using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KredyIo.API.Data;
using KredyIo.API.Models.Entities;

namespace KredyIo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArticlesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ArticlesController> _logger;

    public ArticlesController(ApplicationDbContext context, ILogger<ArticlesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/Articles
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Article>>> GetArticles(
        [FromQuery] string? category = null,
        [FromQuery] bool? isPublished = null)
    {
        var query = _context.Articles.AsQueryable();

        if (!string.IsNullOrEmpty(category))
            query = query.Where(a => a.Category == category);

        if (isPublished.HasValue)
            query = query.Where(a => a.IsPublished == isPublished.Value);

        return await query
            .OrderByDescending(a => a.PublishedAt)
            .ToListAsync();
    }

    // GET: api/Articles/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Article>> GetArticle(int id)
    {
        var article = await _context.Articles.FindAsync(id);
        if (article == null)
            return NotFound();

        // Increment view count
        article.ViewCount++;
        await _context.SaveChangesAsync();

        return article;
    }

    // GET: api/Articles/slug/{slug}
    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<Article>> GetArticleBySlug(string slug)
    {
        var article = await _context.Articles
            .FirstOrDefaultAsync(a => a.Slug == slug);

        if (article == null)
            return NotFound();

        // Increment view count
        article.ViewCount++;
        await _context.SaveChangesAsync();

        return article;
    }

    // GET: api/Articles/categories
    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<string>>> GetCategories()
    {
        var categories = await _context.Articles
            .Where(a => !string.IsNullOrEmpty(a.Category))
            .Select(a => a.Category!)
            .Distinct()
            .ToListAsync();
        return Ok(categories);
    }

    // GET: api/Articles/popular
    [HttpGet("popular")]
    public async Task<ActionResult<IEnumerable<Article>>> GetPopularArticles([FromQuery] int limit = 10)
    {
        return await _context.Articles
            .Where(a => a.IsPublished)
            .OrderByDescending(a => a.ViewCount)
            .Take(limit)
            .ToListAsync();
    }

    // POST: api/Articles
    [HttpPost]
    public async Task<ActionResult<Article>> CreateArticle(Article article)
    {
        _context.Articles.Add(article);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetArticle), new { id = article.Id }, article);
    }

    // PUT: api/Articles/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateArticle(int id, Article article)
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
            if (!_context.Articles.Any(e => e.Id == id))
                return NotFound();
            else
                throw;
        }
        return NoContent();
    }

    // DELETE: api/Articles/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteArticle(int id)
    {
        var article = await _context.Articles.FindAsync(id);
        if (article == null)
            return NotFound();
        _context.Articles.Remove(article);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
