using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KredyIo.API.Data;
using KredyIo.API.Models.Entities;

namespace KredyIo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContentArticlesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ContentArticlesController> _logger;

    public ContentArticlesController(ApplicationDbContext context, ILogger<ContentArticlesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/ContentArticles
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ContentArticle>>> GetContentArticles(
        [FromQuery] string? category = null,
        [FromQuery] bool? isFeatured = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            var query = _context.ContentArticles
                .Where(a => a.IsPublished)
                .AsQueryable();

            if (!string.IsNullOrEmpty(category))
                query = query.Where(a => a.Category == category);

            if (isFeatured.HasValue)
                query = query.Where(a => a.IsFeatured == isFeatured.Value);

            var totalCount = await query.CountAsync();

            var articles = await query
                .OrderByDescending(a => a.PublishedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new
                {
                    a.Id,
                    a.Title,
                    a.Slug,
                    a.MetaDescription,
                    a.Category,
                    a.FeaturedImageUrl,
                    a.Author,
                    a.ReadingTimeMinutes,
                    a.ViewCount,
                    a.IsFeatured,
                    a.PublishedAt
                })
                .ToListAsync();

            return Ok(new
            {
                Articles = articles,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching content articles");
            return StatusCode(500, "An error occurred while fetching articles");
        }
    }

    // GET: api/ContentArticles/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ContentArticle>> GetContentArticle(int id)
    {
        try
        {
            var article = await _context.ContentArticles
                .FirstOrDefaultAsync(a => a.Id == id && a.IsPublished);

            if (article == null)
            {
                return NotFound();
            }

            // Increment view count
            article.ViewCount++;
            await _context.SaveChangesAsync();

            return Ok(article);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching content article {Id}", id);
            return StatusCode(500, "An error occurred while fetching the article");
        }
    }

    // GET: api/ContentArticles/slug/{slug}
    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<ContentArticle>> GetContentArticleBySlug(string slug)
    {
        try
        {
            var article = await _context.ContentArticles
                .FirstOrDefaultAsync(a => a.Slug == slug && a.IsPublished);

            if (article == null)
            {
                return NotFound();
            }

            // Increment view count
            article.ViewCount++;
            await _context.SaveChangesAsync();

            return Ok(article);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching content article by slug {Slug}", slug);
            return StatusCode(500, "An error occurred while fetching the article");
        }
    }

    // GET: api/ContentArticles/featured
    [HttpGet("featured")]
    public async Task<ActionResult<IEnumerable<ContentArticle>>> GetFeaturedArticles([FromQuery] int limit = 5)
    {
        try
        {
            var articles = await _context.ContentArticles
                .Where(a => a.IsPublished && a.IsFeatured)
                .OrderByDescending(a => a.PublishedAt)
                .Take(limit)
                .Select(a => new
                {
                    a.Id,
                    a.Title,
                    a.Slug,
                    a.MetaDescription,
                    a.Category,
                    a.FeaturedImageUrl,
                    a.Author,
                    a.ReadingTimeMinutes,
                    a.ViewCount,
                    a.PublishedAt
                })
                .ToListAsync();

            return Ok(articles);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching featured articles");
            return StatusCode(500, "An error occurred while fetching featured articles");
        }
    }

    // GET: api/ContentArticles/categories
    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<string>>> GetCategories()
    {
        try
        {
            var categories = await _context.ContentArticles
                .Where(a => a.IsPublished)
                .Select(a => a.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();

            return Ok(categories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching categories");
            return StatusCode(500, "An error occurred while fetching categories");
        }
    }

    // GET: api/ContentArticles/popular
    [HttpGet("popular")]
    public async Task<ActionResult<IEnumerable<ContentArticle>>> GetPopularArticles([FromQuery] int limit = 10)
    {
        try
        {
            var articles = await _context.ContentArticles
                .Where(a => a.IsPublished)
                .OrderByDescending(a => a.ViewCount)
                .Take(limit)
                .Select(a => new
                {
                    a.Id,
                    a.Title,
                    a.Slug,
                    a.MetaDescription,
                    a.Category,
                    a.FeaturedImageUrl,
                    a.Author,
                    a.ReadingTimeMinutes,
                    a.ViewCount,
                    a.PublishedAt
                })
                .ToListAsync();

            return Ok(articles);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching popular articles");
            return StatusCode(500, "An error occurred while fetching popular articles");
        }
    }

    // POST: api/ContentArticles
    [HttpPost]
    public async Task<ActionResult<ContentArticle>> CreateContentArticle(ContentArticle article)
    {
        try
        {
            article.CreatedAt = DateTime.UtcNow;
            article.UpdatedAt = DateTime.UtcNow;
            article.PublishedAt = article.IsPublished ? DateTime.UtcNow : DateTime.MinValue;

            _context.ContentArticles.Add(article);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetContentArticle), new { id = article.Id }, article);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating content article");
            return StatusCode(500, "An error occurred while creating the article");
        }
    }

    // PUT: api/ContentArticles/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateContentArticle(int id, ContentArticle article)
    {
        if (id != article.Id)
        {
            return BadRequest();
        }

        try
        {
            article.UpdatedAt = DateTime.UtcNow;
            _context.Entry(article).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await ContentArticleExists(id))
            {
                return NotFound();
            }
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating content article {Id}", id);
            return StatusCode(500, "An error occurred while updating the article");
        }
    }

    // DELETE: api/ContentArticles/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteContentArticle(int id)
    {
        try
        {
            var article = await _context.ContentArticles.FindAsync(id);
            if (article == null)
            {
                return NotFound();
            }

            _context.ContentArticles.Remove(article);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting content article {Id}", id);
            return StatusCode(500, "An error occurred while deleting the article");
        }
    }

    private async Task<bool> ContentArticleExists(int id)
    {
        return await _context.ContentArticles.AnyAsync(e => e.Id == id);
    }
}
