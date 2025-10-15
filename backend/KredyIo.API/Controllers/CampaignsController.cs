using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KredyIo.API.Data;
using KredyIo.API.Models.Entities;
using KredyIo.API.Models.DTOs;

namespace KredyIo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CampaignsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<CampaignsController> _logger;

    public CampaignsController(ApplicationDbContext context, ILogger<CampaignsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/Campaigns
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Campaign>>> GetCampaigns(
        [FromQuery] string? campaignType = null,
        [FromQuery] int? bankId = null,
        [FromQuery] bool? isFeatured = null)
    {
        try
        {
            var query = _context.Campaigns
                .Include(c => c.Bank)
                .Where(c => c.IsActive && c.StartDate <= DateTime.UtcNow && c.EndDate >= DateTime.UtcNow)
                .AsQueryable();

            if (!string.IsNullOrEmpty(campaignType))
                query = query.Where(c => c.CampaignType == campaignType);

            if (bankId.HasValue)
                query = query.Where(c => c.BankId == bankId.Value);

            if (isFeatured.HasValue)
                query = query.Where(c => c.IsFeatured == isFeatured.Value);

            var campaigns = await query
                .OrderByDescending(c => c.IsFeatured)
                .ThenBy(c => c.StartDate)
                .ToListAsync();

            return Ok(campaigns);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching campaigns");
            return StatusCode(500, "An error occurred while fetching campaigns");
        }
    }

    // GET: api/Campaigns/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Campaign>> GetCampaign(int id)
    {
        try
        {
            var campaign = await _context.Campaigns
                .Include(c => c.Bank)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (campaign == null)
            {
                return NotFound();
            }

            return Ok(campaign);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching campaign {Id}", id);
            return StatusCode(500, "An error occurred while fetching the campaign");
        }
    }

    // GET: api/Campaigns/featured
    [HttpGet("featured")]
    public async Task<ActionResult<IEnumerable<Campaign>>> GetFeaturedCampaigns([FromQuery] int limit = 5)
    {
        try
        {
            var campaigns = await _context.Campaigns
                .Include(c => c.Bank)
                .Where(c => c.IsActive && c.IsFeatured &&
                           c.StartDate <= DateTime.UtcNow && c.EndDate >= DateTime.UtcNow)
                .OrderBy(c => c.StartDate)
                .Take(limit)
                .ToListAsync();

            return Ok(campaigns);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching featured campaigns");
            return StatusCode(500, "An error occurred while fetching featured campaigns");
        }
    }

    // GET: api/Campaigns/active
    [HttpGet("active")]
    public async Task<ActionResult<IEnumerable<CampaignDto>>> GetActiveCampaigns(
        [FromQuery] string? campaignType = null,
        [FromQuery] int? bankId = null,
        [FromQuery] int limit = 20)
    {
        try
        {
            var query = _context.Campaigns
                .Include(c => c.Bank)
                .Where(c => c.IsActive && c.StartDate <= DateTime.UtcNow && c.EndDate >= DateTime.UtcNow)
                .AsQueryable();

            if (!string.IsNullOrEmpty(campaignType))
                query = query.Where(c => c.CampaignType == campaignType);

            if (bankId.HasValue)
                query = query.Where(c => c.BankId == bankId.Value);

            var campaigns = await query
                .OrderByDescending(c => c.IsFeatured)
                .ThenByDescending(c => c.StartDate)
                .Take(limit)
                .ToListAsync();

            var campaignDtos = campaigns.Select(c => new CampaignDto
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                CampaignType = c.CampaignType,
                StartDate = c.StartDate,
                EndDate = c.EndDate,
                IsFeatured = c.IsFeatured,
                IsActive = c.IsActive,
                Bank = new BankDto
                {
                    Id = c.Bank.Id,
                    Name = c.Bank.Name,
                    LogoUrl = c.Bank.LogoUrl
                }
            }).ToList();

            return Ok(campaignDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching active campaigns");
            return StatusCode(500, "An error occurred while fetching active campaigns");
        }
    }

    // GET: api/Campaigns/types
    [HttpGet("types")]
    public ActionResult<IEnumerable<string>> GetCampaignTypes()
    {
        return Ok(new[] { "Loan", "CreditCard", "Deposit", "Retirement", "Employee" });
    }

    // GET: api/Campaigns/by-type/{type}
    [HttpGet("by-type/{type}")]
    public async Task<ActionResult<IEnumerable<Campaign>>> GetCampaignsByType(string type)
    {
        try
        {
            var campaigns = await _context.Campaigns
                .Include(c => c.Bank)
                .Where(c => c.IsActive && c.CampaignType == type &&
                           c.StartDate <= DateTime.UtcNow && c.EndDate >= DateTime.UtcNow)
                .OrderByDescending(c => c.IsFeatured)
                .ToListAsync();

            return Ok(campaigns);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching campaigns by type {Type}", type);
            return StatusCode(500, "An error occurred while fetching campaigns by type");
        }
    }

    // POST: api/Campaigns
    [HttpPost]
    public async Task<ActionResult<Campaign>> CreateCampaign(Campaign campaign)
    {
        try
        {
            campaign.CreatedAt = DateTime.UtcNow;
            campaign.UpdatedAt = DateTime.UtcNow;

            _context.Campaigns.Add(campaign);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCampaign), new { id = campaign.Id }, campaign);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating campaign");
            return StatusCode(500, "An error occurred while creating the campaign");
        }
    }

    // PUT: api/Campaigns/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCampaign(int id, Campaign campaign)
    {
        if (id != campaign.Id)
        {
            return BadRequest();
        }

        try
        {
            campaign.UpdatedAt = DateTime.UtcNow;
            _context.Entry(campaign).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await CampaignExists(id))
            {
                return NotFound();
            }
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating campaign {Id}", id);
            return StatusCode(500, "An error occurred while updating the campaign");
        }
    }

    // DELETE: api/Campaigns/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCampaign(int id)
    {
        try
        {
            var campaign = await _context.Campaigns.FindAsync(id);
            if (campaign == null)
            {
                return NotFound();
            }

            _context.Campaigns.Remove(campaign);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting campaign {Id}", id);
            return StatusCode(500, "An error occurred while deleting the campaign");
        }
    }

    private async Task<bool> CampaignExists(int id)
    {
        return await _context.Campaigns.AnyAsync(e => e.Id == id);
    }
}
