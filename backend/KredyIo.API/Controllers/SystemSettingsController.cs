using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KredyIo.API.Data;
using KredyIo.API.Models.Entities;

namespace KredyIo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SystemSettingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<SystemSettingsController> _logger;

    public SystemSettingsController(ApplicationDbContext context, ILogger<SystemSettingsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/SystemSettings
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SystemSetting>>> GetSystemSettings()
    {
        return await _context.SystemSettings.ToListAsync();
    }

    // GET: api/SystemSettings/5
    [HttpGet("{id}")]
    public async Task<ActionResult<SystemSetting>> GetSystemSetting(int id)
    {
        var setting = await _context.SystemSettings.FindAsync(id);
        if (setting == null)
            return NotFound();
        return setting;
    }

    // GET: api/SystemSettings/key/{key}
    [HttpGet("key/{key}")]
    public async Task<ActionResult<SystemSetting>> GetSystemSettingByKey(string key)
    {
        var setting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.Key == key);
        if (setting == null)
            return NotFound();
        return setting;
    }

    // POST: api/SystemSettings
    [HttpPost]
    public async Task<ActionResult<SystemSetting>> CreateSystemSetting(SystemSetting setting)
    {
        _context.SystemSettings.Add(setting);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetSystemSetting), new { id = setting.Id }, setting);
    }

    // PUT: api/SystemSettings/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSystemSetting(int id, SystemSetting setting)
    {
        if (id != setting.Id)
            return BadRequest();
        _context.Entry(setting).State = EntityState.Modified;
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.SystemSettings.Any(e => e.Id == id))
                return NotFound();
            else
                throw;
        }
        return NoContent();
    }

    // DELETE: api/SystemSettings/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSystemSetting(int id)
    {
        var setting = await _context.SystemSettings.FindAsync(id);
        if (setting == null)
            return NotFound();
        _context.SystemSettings.Remove(setting);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
