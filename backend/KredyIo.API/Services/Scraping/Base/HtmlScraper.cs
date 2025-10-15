using HtmlAgilityPack;
using KredyIo.API.Services.Scraping.Base;
using KredyIo.API.Services.Scraping.Interfaces;
using KredyIo.API.Services.Scraping.Models;

namespace KredyIo.API.Services.Scraping.Base;

public abstract class HtmlScraper : BaseScraper, IHtmlScraper
{
    protected HtmlScraper(HttpClient httpClient, ILogger logger, ScrapingConfiguration? configuration = null)
        : base(httpClient, logger, configuration)
    {
    }

    public virtual async Task<string> GetHtmlContentAsync(string url, CancellationToken cancellationToken = default)
    {
        return await GetHttpContentAsync(url, cancellationToken);
    }

    public abstract Task<IEnumerable<T>> ParseHtmlAsync<T>(string html, CancellationToken cancellationToken = default);

    protected virtual HtmlNodeCollection? SelectNodes(HtmlDocument doc, string xpath)
    {
        try
        {
            return doc.DocumentNode.SelectNodes(xpath);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "XPath selection failed: {XPath}", xpath);
            return null;
        }
    }

    protected virtual HtmlNode? SelectSingleNode(HtmlDocument doc, string xpath)
    {
        try
        {
            return doc.DocumentNode.SelectSingleNode(xpath);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "XPath selection failed: {XPath}", xpath);
            return null;
        }
    }

    protected virtual string? GetNodeText(HtmlNode? node)
    {
        if (node == null)
            return null;

        return CleanText(node.InnerText);
    }

    protected virtual string? GetNodeAttribute(HtmlNode? node, string attributeName)
    {
        if (node == null)
            return null;

        return node.GetAttributeValue(attributeName, null);
    }

    protected virtual IEnumerable<HtmlNode> GetTableRows(HtmlDocument doc, string tableSelector)
    {
        var tableNode = SelectSingleNode(doc, tableSelector);
        if (tableNode == null)
        {
            _logger.LogWarning("Table not found with selector: {Selector}", tableSelector);
            return Enumerable.Empty<HtmlNode>();
        }

        var rows = tableNode.SelectNodes(".//tr");
        return rows?.Skip(1) ?? Enumerable.Empty<HtmlNode>(); // Skip header row
    }

    protected virtual List<string> GetTableCells(HtmlNode row)
    {
        var cells = row.SelectNodes(".//td | .//th");
        if (cells == null)
            return new List<string>();

        return cells.Select(cell => CleanText(cell.InnerText)).ToList();
    }
}