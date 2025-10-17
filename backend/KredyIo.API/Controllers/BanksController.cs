using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KredyIo.API.Data;
using KredyIo.API.Models.Entities;
using KredyIo.API.Models.DTOs;

namespace KredyIo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BanksController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<BanksController> _logger;

    public BanksController(ApplicationDbContext context, ILogger<BanksController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/banks
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BankDto>>> GetBanks([FromQuery] bool? isActive = null)
    {
        try
        {
            var query = _context.Banks.AsQueryable();

            if (isActive.HasValue)
            {
                query = query.Where(b => b.IsActive == isActive.Value);
            }

            var banks = await query
                .OrderBy(b => b.Name)
                .Select(b => new BankDto
                {
                    Id = b.Id,
                    Name = b.Name,
                    Code = b.Code,
                    LogoUrl = b.LogoUrl,
                    WebsiteUrl = b.WebsiteUrl,
                    Description = b.Description,
                    Rating = b.Rating,
                    CustomerCount = b.CustomerCount,
                    IsActive = b.IsActive
                })
                .ToListAsync();

            return Ok(banks);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving banks");
            return StatusCode(500, "Internal server error");
        }
    }

    // GET: api/banks/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<BankDto>> GetBank(int id)
    {
        try
        {
            var bank = await _context.Banks
                .Where(b => b.Id == id)
                .Select(b => new BankDto
                {
                    Id = b.Id,
                    Name = b.Name,
                    Code = b.Code,
                    LogoUrl = b.LogoUrl,
                    WebsiteUrl = b.WebsiteUrl,
                    Description = b.Description,
                    Rating = b.Rating,
                    CustomerCount = b.CustomerCount,
                    IsActive = b.IsActive
                })
                .FirstOrDefaultAsync();

            if (bank == null)
            {
                return NotFound($"Bank with ID {id} not found");
            }

            return Ok(bank);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving bank {BankId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    // GET: api/banks/code/{code}
    [HttpGet("code/{code}")]
    public async Task<ActionResult<BankDto>> GetBankByCode(string code)
    {
        try
        {
            var bank = await _context.Banks
                .Where(b => b.Code == code)
                .Select(b => new BankDto
                {
                    Id = b.Id,
                    Name = b.Name,
                    Code = b.Code,
                    LogoUrl = b.LogoUrl,
                    WebsiteUrl = b.WebsiteUrl,
                    Description = b.Description,
                    Rating = b.Rating,
                    CustomerCount = b.CustomerCount,
                    IsActive = b.IsActive
                })
                .FirstOrDefaultAsync();

            if (bank == null)
            {
                return NotFound($"Bank with code {code} not found");
            }

            return Ok(bank);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving bank with code {Code}", code);
            return StatusCode(500, "Internal server error");
        }
    }

    // POST: api/banks
    [HttpPost]
    public async Task<ActionResult<BankDto>> CreateBank(CreateBankDto dto)
    {
        try
        {
            // Check if code already exists
            if (await _context.Banks.AnyAsync(b => b.Code == dto.Code))
            {
                return BadRequest($"Bank with code {dto.Code} already exists");
            }

            var bank = new Bank
            {
                Name = dto.Name,
                Code = dto.Code,
                LogoUrl = dto.LogoUrl,
                WebsiteUrl = dto.WebsiteUrl,
                Description = dto.Description,
                Rating = dto.Rating,
                CustomerCount = dto.CustomerCount,
                IsActive = dto.IsActive ?? true,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            };

            _context.Banks.Add(bank);
            await _context.SaveChangesAsync();

            var result = new BankDto
            {
                Id = bank.Id,
                Name = bank.Name,
                Code = bank.Code,
                LogoUrl = bank.LogoUrl,
                WebsiteUrl = bank.WebsiteUrl,
                Description = bank.Description,
                Rating = bank.Rating,
                CustomerCount = bank.CustomerCount,
                IsActive = bank.IsActive
            };

            return CreatedAtAction(nameof(GetBank), new { id = bank.Id }, result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating bank");
            return StatusCode(500, "Internal server error");
        }
    }

    // PUT: api/banks/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBank(int id, UpdateBankDto dto)
    {
        try
        {
            var bank = await _context.Banks.FindAsync(id);
            if (bank == null)
            {
                return NotFound($"Bank with ID {id} not found");
            }

            // Check if code is being changed and if it already exists
            if (dto.Code != bank.Code && await _context.Banks.AnyAsync(b => b.Code == dto.Code && b.Id != id))
            {
                return BadRequest($"Bank with code {dto.Code} already exists");
            }

            bank.Name = dto.Name;
            bank.Code = dto.Code;
            bank.LogoUrl = dto.LogoUrl;
            bank.WebsiteUrl = dto.WebsiteUrl;
            bank.Description = dto.Description;
            bank.Rating = dto.Rating;
            bank.CustomerCount = dto.CustomerCount;
            bank.IsActive = dto.IsActive ?? bank.IsActive;
            bank.UpdatedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating bank {BankId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    // DELETE: api/banks/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBank(int id)
    {
        try
        {
            var bank = await _context.Banks.FindAsync(id);
            if (bank == null)
            {
                return NotFound($"Bank with ID {id} not found");
            }

            // Soft delete - just mark as inactive
            bank.IsActive = false;
            bank.UpdatedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting bank {BankId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    // GET: api/banks/{id}/products
    [HttpGet("{id}/products")]
    public async Task<ActionResult<object>> GetBankProducts(int id)
    {
        try
        {
            var bank = await _context.Banks
                .Include(b => b.DepositProducts)
                .Include(b => b.CreditCards)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (bank == null)
            {
                return NotFound($"Bank with ID {id} not found");
            }

            var result = new
            {
                BankId = bank.Id,
                BankName = bank.Name,
                DepositProducts = bank.DepositProducts.Where(p => p.IsActive).Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Type,
                    p.InterestRate,
                    p.MinimumAmount,
                    p.MaximumAmount,
                    p.MinimumTerm,
                    p.MaximumTerm
                }),
                CreditCards = bank.CreditCards.Where(c => c.IsActive).Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Type,
                    c.AnnualFee,
                    c.CashAdvanceRate,
                    c.PurchaseRate
                })
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving products for bank {BankId}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}
