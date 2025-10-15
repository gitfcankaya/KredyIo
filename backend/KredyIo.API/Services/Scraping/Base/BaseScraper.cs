using HtmlAgilityPack;
using KredyIo.API.Services.Scraping.Interfaces;
using KredyIo.API.Services.Scraping.Models;
using System.Text;

namespace KredyIo.API.Services.Scraping.Base;

public abstract class BaseScraper : IBaseScraper
{
    protected readonly HttpClient _httpClient;
    protected readonly ILogger _logger;
    protected readonly ScrapingConfiguration _configuration;

    protected BaseScraper(HttpClient httpClient, ILogger logger, ScrapingConfiguration? configuration = null)
    {
        _httpClient = httpClient;
        _logger = logger;
        _configuration = configuration ?? new ScrapingConfiguration();
        
        ConfigureHttpClient();
    }

    public abstract string GetSourceName();
    public abstract string GetSourceUrl();
    public abstract Task<IScrapingResult> ScrapeAsync(CancellationToken cancellationToken = default);

    public virtual async Task<bool> ValidateSourceAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _httpClient.GetAsync(GetSourceUrl(), cancellationToken);
            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Source validation failed for {Source}", GetSourceName());
            return false;
        }
    }

    protected virtual void ConfigureHttpClient()
    {
        _httpClient.DefaultRequestHeaders.Clear();
        _httpClient.DefaultRequestHeaders.Add("User-Agent", _configuration.UserAgent);
        _httpClient.Timeout = TimeSpan.FromSeconds(_configuration.TimeoutSeconds);

        foreach (var header in _configuration.Headers)
        {
            _httpClient.DefaultRequestHeaders.Add(header.Key, header.Value);
        }
    }

    protected virtual async Task<string> GetHttpContentAsync(string url, CancellationToken cancellationToken = default)
    {
        var attempt = 0;
        Exception? lastException = null;

        while (attempt < _configuration.RetryCount)
        {
            try
            {
                if (attempt > 0)
                {
                    await Task.Delay(_configuration.DelayBetweenRequestsMs * attempt, cancellationToken);
                }

                var response = await _httpClient.GetAsync(url, cancellationToken);
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync(cancellationToken);
                
                _logger.LogDebug("Successfully retrieved content from {Url}, Length: {Length}", url, content.Length);
                
                return content;
            }
            catch (Exception ex)
            {
                lastException = ex;
                attempt++;
                
                _logger.LogWarning(ex, "Attempt {Attempt} failed for {Url}", attempt, url);
            }
        }

        _logger.LogError(lastException, "All {RetryCount} attempts failed for {Url}", _configuration.RetryCount, url);
        throw lastException ?? new Exception("Unknown error occurred during HTTP request");
    }

    protected virtual HtmlDocument LoadHtmlDocument(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        return doc;
    }

    protected virtual string CleanText(string? text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return string.Empty;

        return text.Trim()
                   .Replace("\n", " ")
                   .Replace("\r", " ")
                   .Replace("\t", " ")
                   .Replace("&nbsp;", " ")
                   .Replace("&amp;", "&")
                   .Replace("&lt;", "<")
                   .Replace("&gt;", ">")
                   .Replace("&quot;", "\"")
                   .Replace("&#39;", "'")
                   .Replace("  ", " ")
                   .Trim();
    }

    protected virtual decimal ParseDecimal(string? value, decimal defaultValue = 0)
    {
        if (string.IsNullOrWhiteSpace(value))
            return defaultValue;

        // Remove common non-numeric characters
        var cleanValue = value.Replace(",", ".")
                             .Replace("%", "")
                             .Replace("₺", "")
                             .Replace("$", "")
                             .Replace("€", "")
                             .Replace("£", "")
                             .Replace(" ", "")
                             .Trim();

        if (decimal.TryParse(cleanValue, out var result))
            return result;

        _logger.LogWarning("Could not parse decimal value: {Value}", value);
        return defaultValue;
    }

    protected virtual DateTime ParseDateTime(string? value, DateTime? defaultValue = null)
    {
        if (string.IsNullOrWhiteSpace(value))
            return defaultValue ?? DateTime.UtcNow;

        // Common Turkish date formats
        var formats = new[]
        {
            "dd.MM.yyyy",
            "dd/MM/yyyy",
            "yyyy-MM-dd",
            "dd.MM.yyyy HH:mm",
            "dd/MM/yyyy HH:mm",
            "yyyy-MM-dd HH:mm:ss",
            "yyyy-MM-ddTHH:mm:ss"
        };

        foreach (var format in formats)
        {
            if (DateTime.TryParseExact(value, format, null, System.Globalization.DateTimeStyles.None, out var result))
                return result;
        }

        if (DateTime.TryParse(value, out var parsedDate))
            return parsedDate;

        _logger.LogWarning("Could not parse date value: {Value}", value);
        return defaultValue ?? DateTime.UtcNow;
    }

    protected virtual async Task<Models.ScrapingResult> CreateSuccessResultAsync(
        int recordsFound = 0, 
        int recordsUpdated = 0, 
        int recordsCreated = 0, 
        string? rawData = null,
        Dictionary<string, object>? metadata = null)
    {
        var result = Models.ScrapingResult.Success(recordsFound, recordsUpdated, recordsCreated, rawData);
        result.Metadata = metadata;
        return result;
    }

    protected virtual async Task<Models.ScrapingResult> CreateFailureResultAsync(
        string errorMessage, 
        string? rawData = null,
        Dictionary<string, object>? metadata = null)
    {
        var result = Models.ScrapingResult.Failure(errorMessage, rawData);
        result.Metadata = metadata;
        return result;
    }

    protected virtual void LogScrapingStart()
    {
        _logger.LogInformation("Starting scraping for {Source} at {Url}", GetSourceName(), GetSourceUrl());
    }

    protected virtual void LogScrapingSuccess(int recordsProcessed, TimeSpan duration)
    {
        _logger.LogInformation("Scraping completed successfully for {Source}. Records: {Records}, Duration: {Duration}ms", 
            GetSourceName(), recordsProcessed, duration.TotalMilliseconds);
    }

    protected virtual void LogScrapingError(Exception exception, TimeSpan duration)
    {
        _logger.LogError(exception, "Scraping failed for {Source} after {Duration}ms", 
            GetSourceName(), duration.TotalMilliseconds);
    }

    protected virtual async Task DelayAsync(CancellationToken cancellationToken = default)
    {
        if (_configuration.DelayBetweenRequestsMs > 0)
        {
            await Task.Delay(_configuration.DelayBetweenRequestsMs, cancellationToken);
        }
    }
}