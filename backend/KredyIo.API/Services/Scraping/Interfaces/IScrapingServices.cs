using KredyIo.API.Models.Entities;
using KredyIo.API.Models.Enums;

namespace KredyIo.API.Services.Scraping.Interfaces;

public interface IScrapingResult
{
    bool IsSuccess { get; }
    string? ErrorMessage { get; }
    int RecordsFound { get; }
    int RecordsUpdated { get; }
    int RecordsCreated { get; }
    string? RawData { get; }
    Dictionary<string, object>? Metadata { get; }
}

public interface IBaseScraper
{
    Task<IScrapingResult> ScrapeAsync(CancellationToken cancellationToken = default);
    Task<bool> ValidateSourceAsync(CancellationToken cancellationToken = default);
    string GetSourceName();
    string GetSourceUrl();
}

public interface IHtmlScraper : IBaseScraper
{
    Task<string> GetHtmlContentAsync(string url, CancellationToken cancellationToken = default);
    Task<IEnumerable<T>> ParseHtmlAsync<T>(string html, CancellationToken cancellationToken = default);
}

public interface IApiScraper : IBaseScraper
{
    Task<string> GetApiResponseAsync(string endpoint, CancellationToken cancellationToken = default);
    Task<T?> ParseApiResponseAsync<T>(string response, CancellationToken cancellationToken = default);
}

public interface ISeleniumScraper : IBaseScraper
{
    Task<string> GetPageSourceAsync(string url, CancellationToken cancellationToken = default);
    Task<IEnumerable<T>> ParsePageAsync<T>(string url, CancellationToken cancellationToken = default);
}

public interface ICurrencyRateScraper : IBaseScraper
{
    Task<IScrapingResult> ScrapeCurrencyRatesAsync(CancellationToken cancellationToken = default);
}

public interface IGoldPriceScraper : IBaseScraper
{
    Task<IScrapingResult> ScrapeGoldPricesAsync(CancellationToken cancellationToken = default);
}

public interface IStockDataScraper : IBaseScraper
{
    Task<IScrapingResult> ScrapeStockDataAsync(CancellationToken cancellationToken = default);
}

public interface INewsScraper : IBaseScraper
{
    Task<IScrapingResult> ScrapeNewsAsync(CancellationToken cancellationToken = default);
}

public interface IBankProductScraper : IBaseScraper
{
    Task<IScrapingResult> ScrapeBankProductsAsync(int bankId, CancellationToken cancellationToken = default);
}

public interface IScrapingJobService
{
    Task<int> CreateJobAsync(ScrapingJob job, CancellationToken cancellationToken = default);
    Task<bool> UpdateJobAsync(ScrapingJob job, CancellationToken cancellationToken = default);
    Task<bool> DeleteJobAsync(int jobId, CancellationToken cancellationToken = default);
    Task<ScrapingJob?> GetJobAsync(int jobId, CancellationToken cancellationToken = default);
    Task<IEnumerable<ScrapingJob>> GetActiveJobsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<ScrapingJob>> GetJobsByTypeAsync(ScrapingDataType dataType, CancellationToken cancellationToken = default);
    Task<bool> StartJobAsync(int jobId, CancellationToken cancellationToken = default);
    Task<bool> StopJobAsync(int jobId, CancellationToken cancellationToken = default);
    Task<bool> RunJobOnceAsync(int jobId, CancellationToken cancellationToken = default);
}

public interface IScrapingResultService
{
    Task<int> CreateResultAsync(ScrapingResult result, CancellationToken cancellationToken = default);
    Task<bool> UpdateResultAsync(ScrapingResult result, CancellationToken cancellationToken = default);
    Task<ScrapingResult?> GetResultAsync(int resultId, CancellationToken cancellationToken = default);
    Task<IEnumerable<ScrapingResult>> GetResultsByJobAsync(int jobId, int pageNumber = 1, int pageSize = 50, CancellationToken cancellationToken = default);
    Task<IEnumerable<ScrapingResult>> GetFailedResultsAsync(DateTime? since = null, CancellationToken cancellationToken = default);
    Task<ScrapingStatistics> GetStatisticsAsync(DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default);
}

public interface IDataAggregationService
{
    Task<IEnumerable<CurrencyRate>> GetLatestCurrencyRatesAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<GoldPrice>> GetLatestGoldPricesAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<StockData>> GetLatestStockDataAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<NewsArticle>> GetLatestNewsAsync(int count = 20, CancellationToken cancellationToken = default);
    Task<IEnumerable<EconomicIndicator>> GetLatestIndicatorsAsync(CancellationToken cancellationToken = default);
    Task<decimal?> GetCurrencyRateAsync(string currencyCode, CancellationToken cancellationToken = default);
    Task<decimal?> GetGoldPriceAsync(string goldType, CancellationToken cancellationToken = default);
    Task<decimal?> GetStockPriceAsync(string symbol, CancellationToken cancellationToken = default);
}

public class ScrapingStatistics
{
    public int TotalJobs { get; set; }
    public int ActiveJobs { get; set; }
    public int CompletedJobs { get; set; }
    public int FailedJobs { get; set; }
    public decimal SuccessRate { get; set; }
    public decimal AverageExecutionTime { get; set; }
    public int TotalRecordsScraped { get; set; }
    public DateTime LastUpdateTime { get; set; }
    public Dictionary<string, int> JobsByType { get; set; } = new();
    public Dictionary<string, int> JobsByStatus { get; set; } = new();
}