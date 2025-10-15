using KredyIo.API.Services.Scraping.Interfaces;

namespace KredyIo.API.Services.Scraping.Models;

public class ScrapingResult : IScrapingResult
{
    public bool IsSuccess { get; set; }
    public string? ErrorMessage { get; set; }
    public int RecordsFound { get; set; }
    public int RecordsUpdated { get; set; }
    public int RecordsCreated { get; set; }
    public string? RawData { get; set; }
    public Dictionary<string, object>? Metadata { get; set; }
    
    public static ScrapingResult Success(int recordsFound = 0, int recordsUpdated = 0, int recordsCreated = 0, string? rawData = null)
    {
        return new ScrapingResult
        {
            IsSuccess = true,
            RecordsFound = recordsFound,
            RecordsUpdated = recordsUpdated,
            RecordsCreated = recordsCreated,
            RawData = rawData
        };
    }
    
    public static ScrapingResult Failure(string errorMessage, string? rawData = null)
    {
        return new ScrapingResult
        {
            IsSuccess = false,
            ErrorMessage = errorMessage,
            RawData = rawData
        };
    }
}

public class ScrapingConfiguration
{
    public string UserAgent { get; set; } = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
    public int TimeoutSeconds { get; set; } = 30;
    public int RetryCount { get; set; } = 3;
    public int DelayBetweenRequestsMs { get; set; } = 1000;
    public bool UseProxy { get; set; } = false;
    public string? ProxyUrl { get; set; }
    public Dictionary<string, string> Headers { get; set; } = new();
    public Dictionary<string, string> Cookies { get; set; } = new();
}

public class CurrencyRateModel
{
    public string CurrencyCode { get; set; } = null!;
    public string CurrencyName { get; set; } = null!;
    public decimal BuyingRate { get; set; }
    public decimal SellingRate { get; set; }
    public decimal? CentralRate { get; set; }
    public DateTime RateDate { get; set; }
    public string Source { get; set; } = null!;
}

public class GoldPriceModel
{
    public string GoldType { get; set; } = null!;
    public decimal BuyingPrice { get; set; }
    public decimal SellingPrice { get; set; }
    public DateTime PriceDate { get; set; }
    public string Source { get; set; } = null!;
}

public class StockDataModel
{
    public string Symbol { get; set; } = null!;
    public string CompanyName { get; set; } = null!;
    public decimal CurrentPrice { get; set; }
    public decimal? OpenPrice { get; set; }
    public decimal? HighPrice { get; set; }
    public decimal? LowPrice { get; set; }
    public decimal? PreviousClose { get; set; }
    public long? Volume { get; set; }
    public DateTime DataDate { get; set; }
    public string Source { get; set; } = null!;
}

public class NewsArticleModel
{
    public string Title { get; set; } = null!;
    public string? Summary { get; set; }
    public string? Content { get; set; }
    public string SourceUrl { get; set; } = null!;
    public string Source { get; set; } = null!;
    public string? Author { get; set; }
    public string? ImageUrl { get; set; }
    public string? Category { get; set; }
    public List<string> Tags { get; set; } = new();
    public DateTime PublishedAt { get; set; }
}

public class BankProductModel
{
    public int BankId { get; set; }
    public string ProductType { get; set; } = null!; // Kredi, Mevduat, Kredi Kartı
    public string ProductName { get; set; } = null!;
    public decimal? InterestRate { get; set; }
    public decimal? MinAmount { get; set; }
    public decimal? MaxAmount { get; set; }
    public int? TermMonths { get; set; }
    public string? Features { get; set; }
    public string? Requirements { get; set; }
    public string? Fees { get; set; }
    public string SourceUrl { get; set; } = null!;
}