using System.Xml.Linq;
using KredyIo.API.Data;
using KredyIo.API.Models.Entities;
using KredyIo.API.Services.Scraping.Base;
using KredyIo.API.Services.Scraping.Interfaces;
using KredyIo.API.Services.Scraping.Models;
using Microsoft.EntityFrameworkCore;

namespace KredyIo.API.Services.Scraping.Scrapers;

public class TcmbCurrencyRateScraper : HtmlScraper, ICurrencyRateScraper
{
    private readonly ApplicationDbContext _context;
    private const string TCMB_URL = "https://www.tcmb.gov.tr/kurlar/today.xml";
    private const string TCMB_FALLBACK_URL = "https://www.tcmb.gov.tr/kurlar/kurlar_tr.html";

    public TcmbCurrencyRateScraper(
        HttpClient httpClient, 
        ILogger<TcmbCurrencyRateScraper> logger,
        ApplicationDbContext context,
        ScrapingConfiguration? configuration = null) 
        : base(httpClient, logger, configuration)
    {
        _context = context;
    }

    public override string GetSourceName() => "TCMB (Türkiye Cumhuriyet Merkez Bankası)";
    public override string GetSourceUrl() => TCMB_URL;

    public override async Task<IScrapingResult> ScrapeAsync(CancellationToken cancellationToken = default)
    {
        return await ScrapeCurrencyRatesAsync(cancellationToken);
    }

    public override async Task<IEnumerable<T>> ParseHtmlAsync<T>(string html, CancellationToken cancellationToken = default)
    {
        // This method is not used directly for currency rates
        return Enumerable.Empty<T>();
    }

    public async Task<IScrapingResult> ScrapeCurrencyRatesAsync(CancellationToken cancellationToken = default)
    {
        var startTime = DateTime.UtcNow;
        LogScrapingStart();

        try
        {
            // First try XML endpoint
            var xmlResult = await TryParseXmlAsync(cancellationToken);
            if (xmlResult.IsSuccess)
            {
                LogScrapingSuccess(xmlResult.RecordsCreated + xmlResult.RecordsUpdated, DateTime.UtcNow - startTime);
                return xmlResult;
            }

            // Fallback to HTML scraping
            _logger.LogWarning("XML parsing failed, trying HTML fallback");
            var htmlResult = await TryParseHtmlAsync(cancellationToken);
            
            LogScrapingSuccess(htmlResult.RecordsCreated + htmlResult.RecordsUpdated, DateTime.UtcNow - startTime);
            return htmlResult;
        }
        catch (Exception ex)
        {
            LogScrapingError(ex, DateTime.UtcNow - startTime);
            return await CreateFailureResultAsync(ex.Message);
        }
    }

    private async Task<Models.ScrapingResult> TryParseXmlAsync(CancellationToken cancellationToken)
    {
        try
        {
            var xmlContent = await GetHttpContentAsync(TCMB_URL, cancellationToken);
            var doc = XDocument.Parse(xmlContent);

            var currencies = doc.Root?.Element("Currency");
            if (currencies == null)
            {
                return await CreateFailureResultAsync("No currency data found in XML");
            }

            var rates = new List<CurrencyRateModel>();
            var currencyNodes = doc.Root?.Elements("Currency") ?? Enumerable.Empty<XElement>();

            foreach (var currency in currencyNodes)
            {
                var code = currency.Attribute("CurrencyCode")?.Value;
                var name = currency.Element("CurrencyName")?.Value;
                var buyingRate = currency.Element("ForexBuying")?.Value;
                var sellingRate = currency.Element("ForexSelling")?.Value;
                var centralRate = currency.Element("BanknoteBuying")?.Value;

                if (string.IsNullOrEmpty(code) || string.IsNullOrEmpty(name))
                    continue;

                rates.Add(new CurrencyRateModel
                {
                    CurrencyCode = code,
                    CurrencyName = name,
                    BuyingRate = ParseDecimal(buyingRate),
                    SellingRate = ParseDecimal(sellingRate),
                    CentralRate = ParseDecimal(centralRate),
                    RateDate = DateTime.Today,
                    Source = GetSourceName()
                });
            }

            var result = await SaveCurrencyRatesAsync(rates, cancellationToken);
            
            return await CreateSuccessResultAsync(
                recordsFound: rates.Count,
                recordsUpdated: result.updated,
                recordsCreated: result.created,
                rawData: xmlContent
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "XML parsing failed for TCMB");
            return await CreateFailureResultAsync($"XML parsing failed: {ex.Message}");
        }
    }

    private async Task<Models.ScrapingResult> TryParseHtmlAsync(CancellationToken cancellationToken)
    {
        try
        {
            var htmlContent = await GetHttpContentAsync(TCMB_FALLBACK_URL, cancellationToken);
            var doc = LoadHtmlDocument(htmlContent);

            // TCMB HTML table parsing
            var tableRows = GetTableRows(doc, "//table[@class='responsive']");
            var rates = new List<CurrencyRateModel>();

            foreach (var row in tableRows)
            {
                var cells = GetTableCells(row);
                if (cells.Count < 6) continue;

                var code = CleanText(cells[0]);
                var name = CleanText(cells[1]);
                var buying = CleanText(cells[3]);
                var selling = CleanText(cells[4]);

                if (string.IsNullOrEmpty(code) || code.Length != 3)
                    continue;

                rates.Add(new CurrencyRateModel
                {
                    CurrencyCode = code,
                    CurrencyName = name,
                    BuyingRate = ParseDecimal(buying),
                    SellingRate = ParseDecimal(selling),
                    RateDate = DateTime.Today,
                    Source = GetSourceName()
                });
            }

            var result = await SaveCurrencyRatesAsync(rates, cancellationToken);

            return await CreateSuccessResultAsync(
                recordsFound: rates.Count,
                recordsUpdated: result.updated,
                recordsCreated: result.created,
                rawData: htmlContent?.Substring(0, Math.Min(1000, htmlContent.Length))
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "HTML parsing failed for TCMB");
            return await CreateFailureResultAsync($"HTML parsing failed: {ex.Message}");
        }
    }

    private async Task<(int created, int updated)> SaveCurrencyRatesAsync(
        List<CurrencyRateModel> rates, 
        CancellationToken cancellationToken)
    {
        int created = 0, updated = 0;

        foreach (var rate in rates)
        {
            // Check if rate already exists for today
            var existingRate = await _context.CurrencyRates
                .FirstOrDefaultAsync(r => 
                    r.CurrencyCode == rate.CurrencyCode && 
                    r.RateDate.Date == rate.RateDate.Date &&
                    r.Source == rate.Source, 
                cancellationToken);

            if (existingRate != null)
            {
                // Update existing rate
                existingRate.BuyingRate = rate.BuyingRate;
                existingRate.SellingRate = rate.SellingRate;
                existingRate.CentralRate = rate.CentralRate;
                existingRate.UpdatedAt = DateTime.UtcNow;
                updated++;
            }
            else
            {
                // Create new rate
                var newRate = new CurrencyRate
                {
                    CurrencyCode = rate.CurrencyCode,
                    CurrencyName = rate.CurrencyName,
                    BuyingRate = rate.BuyingRate,
                    SellingRate = rate.SellingRate,
                    CentralRate = rate.CentralRate,
                    RateDate = rate.RateDate,
                    Source = rate.Source,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.CurrencyRates.Add(newRate);
                created++;
            }
        }

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Currency rates saved: {Created} created, {Updated} updated", created, updated);
        
        return (created, updated);
    }
}