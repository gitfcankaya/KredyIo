using Hangfire;
using KredyIo.API.Data;
using KredyIo.API.Models.Entities;
using KredyIo.API.Models.Enums;
using KredyIo.API.Services.Scraping.Interfaces;
using KredyIo.API.Services.Scraping.Scrapers;
using Microsoft.EntityFrameworkCore;

namespace KredyIo.API.Services.Scraping;

public class ScrapingJobService : IScrapingJobService
{
    private readonly ApplicationDbContext _context;
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<ScrapingJobService> _logger;
    private readonly IBackgroundJobClient _backgroundJobClient;
    private readonly IRecurringJobManager _recurringJobManager;

    public ScrapingJobService(
        ApplicationDbContext context,
        IServiceProvider serviceProvider,
        ILogger<ScrapingJobService> logger,
        IBackgroundJobClient backgroundJobClient,
        IRecurringJobManager recurringJobManager)
    {
        _context = context;
        _serviceProvider = serviceProvider;
        _logger = logger;
        _backgroundJobClient = backgroundJobClient;
        _recurringJobManager = recurringJobManager;
    }

    public async Task<int> CreateJobAsync(ScrapingJob job, CancellationToken cancellationToken = default)
    {
        try
        {
            job.CreatedAt = DateTime.UtcNow;
            job.UpdatedAt = DateTime.UtcNow;
            
            _context.ScrapingJobs.Add(job);
            await _context.SaveChangesAsync(cancellationToken);

            if (job.IsActive)
            {
                await ScheduleJobAsync(job);
            }

            _logger.LogInformation("Created scraping job {JobId}: {JobName}", job.Id, job.JobName);
            return job.Id;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating scraping job: {JobName}", job.JobName);
            throw;
        }
    }

    public async Task<bool> UpdateJobAsync(ScrapingJob job, CancellationToken cancellationToken = default)
    {
        try
        {
            var existingJob = await _context.ScrapingJobs.FindAsync(new object[] { job.Id }, cancellationToken);
            if (existingJob == null)
                return false;

            // Update properties
            existingJob.JobName = job.JobName;
            existingJob.Description = job.Description;
            existingJob.DataType = job.DataType;
            existingJob.Method = job.Method;
            existingJob.SourceUrl = job.SourceUrl;
            existingJob.FrequencyMinutes = job.FrequencyMinutes;
            existingJob.Configuration = job.Configuration;
            existingJob.IsActive = job.IsActive;
            existingJob.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);

            // Update scheduled job
            if (existingJob.IsActive)
            {
                await ScheduleJobAsync(existingJob);
            }
            else
            {
                _recurringJobManager.RemoveIfExists($"scraping-job-{existingJob.Id}");
            }

            _logger.LogInformation("Updated scraping job {JobId}: {JobName}", job.Id, job.JobName);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating scraping job {JobId}", job.Id);
            return false;
        }
    }

    public async Task<bool> DeleteJobAsync(int jobId, CancellationToken cancellationToken = default)
    {
        try
        {
            var job = await _context.ScrapingJobs.FindAsync(new object[] { jobId }, cancellationToken);
            if (job == null)
                return false;

            // Remove from Hangfire
            _recurringJobManager.RemoveIfExists($"scraping-job-{jobId}");

            // Soft delete
            job.IsActive = false;
            job.DeletedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Deleted scraping job {JobId}: {JobName}", jobId, job.JobName);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting scraping job {JobId}", jobId);
            return false;
        }
    }

    public async Task<ScrapingJob?> GetJobAsync(int jobId, CancellationToken cancellationToken = default)
    {
        return await _context.ScrapingJobs
            .Include(j => j.Results.OrderByDescending(r => r.StartTime).Take(10))
            .FirstOrDefaultAsync(j => j.Id == jobId && j.DeletedAt == null, cancellationToken);
    }

    public async Task<IEnumerable<ScrapingJob>> GetActiveJobsAsync(CancellationToken cancellationToken = default)
    {
        return await _context.ScrapingJobs
            .Where(j => j.IsActive && j.DeletedAt == null)
            .Include(j => j.Results.OrderByDescending(r => r.StartTime).Take(5))
            .OrderBy(j => j.JobName)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ScrapingJob>> GetJobsByTypeAsync(ScrapingDataType dataType, CancellationToken cancellationToken = default)
    {
        return await _context.ScrapingJobs
            .Where(j => j.DataType == dataType && j.DeletedAt == null)
            .Include(j => j.Results.OrderByDescending(r => r.StartTime).Take(5))
            .OrderBy(j => j.JobName)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> StartJobAsync(int jobId, CancellationToken cancellationToken = default)
    {
        try
        {
            var job = await GetJobAsync(jobId, cancellationToken);
            if (job == null)
                return false;

            job.IsActive = true;
            job.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync(cancellationToken);
            await ScheduleJobAsync(job);

            _logger.LogInformation("Started scraping job {JobId}: {JobName}", jobId, job.JobName);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error starting scraping job {JobId}", jobId);
            return false;
        }
    }

    public async Task<bool> StopJobAsync(int jobId, CancellationToken cancellationToken = default)
    {
        try
        {
            var job = await GetJobAsync(jobId, cancellationToken);
            if (job == null)
                return false;

            job.IsActive = false;
            job.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync(cancellationToken);
            _recurringJobManager.RemoveIfExists($"scraping-job-{jobId}");

            _logger.LogInformation("Stopped scraping job {JobId}: {JobName}", jobId, job.JobName);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error stopping scraping job {JobId}", jobId);
            return false;
        }
    }

    public async Task<bool> RunJobOnceAsync(int jobId, CancellationToken cancellationToken = default)
    {
        try
        {
            var job = await GetJobAsync(jobId, cancellationToken);
            if (job == null)
                return false;

            // Queue immediate execution
            _backgroundJobClient.Enqueue(() => ExecuteScrapingJobAsync(jobId));

            _logger.LogInformation("Queued immediate execution for scraping job {JobId}: {JobName}", jobId, job.JobName);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error queuing scraping job {JobId}", jobId);
            return false;
        }
    }

    private async Task ScheduleJobAsync(ScrapingJob job)
    {
        var cronExpression = GetCronExpression(job.FrequencyMinutes);
        var jobId = $"scraping-job-{job.Id}";

        _recurringJobManager.AddOrUpdate(
            jobId,
            () => ExecuteScrapingJobAsync(job.Id),
            cronExpression,
            new RecurringJobOptions
            {
                TimeZone = TimeZoneInfo.FindSystemTimeZoneById("Turkey Standard Time")
            }
        );

        _logger.LogInformation("Scheduled scraping job {JobId} with cron: {Cron}", job.Id, cronExpression);
    }

    private string GetCronExpression(int frequencyMinutes)
    {
        return frequencyMinutes switch
        {
            1 => "* * * * *",           // Every minute
            5 => "*/5 * * * *",        // Every 5 minutes
            15 => "*/15 * * * *",      // Every 15 minutes
            30 => "*/30 * * * *",      // Every 30 minutes
            60 => "0 * * * *",         // Every hour
            240 => "0 */4 * * *",      // Every 4 hours
            720 => "0 */12 * * *",     // Every 12 hours
            1440 => "0 0 * * *",       // Daily
            _ => "0 * * * *"           // Default: hourly
        };
    }

    [AutomaticRetry(Attempts = 3, DelaysInSeconds = new[] { 30, 60, 120 })]
    public async Task ExecuteScrapingJobAsync(int jobId)
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<ScrapingJobService>>();

        var job = await context.ScrapingJobs.FindAsync(jobId);
        if (job == null || !job.IsActive)
        {
            logger.LogWarning("Scraping job {JobId} not found or inactive", jobId);
            return;
        }

        var result = new ScrapingResult
        {
            ScrapingJobId = jobId,
            Status = ScrapingStatus.Running,
            StartTime = DateTime.UtcNow
        };

        try
        {
            context.ScrapingResults.Add(result);
            await context.SaveChangesAsync();

            // Get appropriate scraper
            var scraper = GetScraperForJob(job, scope.ServiceProvider);
            if (scraper == null)
            {
                throw new InvalidOperationException($"No scraper found for job type: {job.DataType}");
            }

            // Execute scraping
            var scrapingResult = await scraper.ScrapeAsync();

            // Update result
            result.Status = scrapingResult.IsSuccess ? ScrapingStatus.Completed : ScrapingStatus.Failed;
            result.EndTime = DateTime.UtcNow;
            result.Duration = (decimal)(result.EndTime.Value - result.StartTime).TotalSeconds;
            result.RecordsFound = scrapingResult.RecordsFound;
            result.RecordsUpdated = scrapingResult.RecordsUpdated;
            result.RecordsCreated = scrapingResult.RecordsCreated;
            result.RawData = scrapingResult.RawData;
            result.ErrorMessage = scrapingResult.ErrorMessage;

            // Update job last run time
            job.LastRunAt = DateTime.UtcNow;
            if (scrapingResult.IsSuccess)
            {
                job.LastSuccessAt = DateTime.UtcNow;
            }

            await context.SaveChangesAsync();

            logger.LogInformation("Scraping job {JobId} completed: {Status}", jobId, result.Status);
        }
        catch (Exception ex)
        {
            result.Status = ScrapingStatus.Failed;
            result.EndTime = DateTime.UtcNow;
            result.Duration = (decimal)(result.EndTime.Value - result.StartTime).TotalSeconds;
            result.ErrorMessage = ex.Message;
            result.StackTrace = ex.StackTrace;

            await context.SaveChangesAsync();

            logger.LogError(ex, "Scraping job {JobId} failed", jobId);
            throw;
        }
    }

    private IBaseScraper? GetScraperForJob(ScrapingJob job, IServiceProvider serviceProvider)
    {
        return job.DataType switch
        {
            ScrapingDataType.CurrencyRates => serviceProvider.GetService<TcmbCurrencyRateScraper>(),
            ScrapingDataType.GoldPrices => serviceProvider.GetService<BigParaGoldPriceScraper>(),
            //ScrapingDataType.StockData => serviceProvider.GetService<BistStockDataScraper>(),
            //ScrapingDataType.NewsContent => serviceProvider.GetService<BloombergNewsScraper>(),
            _ => null
        };
    }
}