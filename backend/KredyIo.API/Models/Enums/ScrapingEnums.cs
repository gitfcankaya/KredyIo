using System.ComponentModel;

namespace KredyIo.API.Models.Enums;

public enum ScrapingStatus
{
    [Description("Bekliyor")]
    Pending = 1,
    
    [Description("Çalışıyor")]
    Running = 2,
    
    [Description("Tamamlandı")]
    Completed = 3,
    
    [Description("Başarısız")]
    Failed = 4,
    
    [Description("İptal Edildi")]
    Cancelled = 5,
    
    [Description("Durduruldu")]
    Stopped = 6
}

public enum ScrapingDataType
{
    [Description("Kredi Faiz Oranları")]
    CreditRates = 1,
    
    [Description("Mevduat Faiz Oranları")]
    DepositRates = 2,
    
    [Description("Döviz Kurları")]
    CurrencyRates = 3,
    
    [Description("Altın Fiyatları")]
    GoldPrices = 4,
    
    [Description("Hisse Senedi Verileri")]
    StockData = 5,
    
    [Description("Borsa Endeksleri")]
    StockIndexes = 6,
    
    [Description("Haber İçeriği")]
    NewsContent = 7,
    
    [Description("Banka Ürün Bilgileri")]
    BankProducts = 8,
    
    [Description("Ekonomik Göstergeler")]
    EconomicIndicators = 9
}

public enum ScrapingMethod
{
    [Description("HTML Parser")]
    HtmlParser = 1,
    
    [Description("JSON API")]
    JsonApi = 2,
    
    [Description("XML Parser")]
    XmlParser = 3,
    
    [Description("Selenium WebDriver")]
    SeleniumWebDriver = 4,
    
    [Description("RSS Feed")]
    RssFeed = 5,
    
    [Description("Web Socket")]
    WebSocket = 6
}

public enum ScrapingFrequency
{
    [Description("1 Dakika")]
    OneMinute = 1,
    
    [Description("5 Dakika")]
    FiveMinutes = 5,
    
    [Description("15 Dakika")]
    FifteenMinutes = 15,
    
    [Description("30 Dakika")]
    ThirtyMinutes = 30,
    
    [Description("1 Saat")]
    OneHour = 60,
    
    [Description("4 Saat")]
    FourHours = 240,
    
    [Description("12 Saat")]
    TwelveHours = 720,
    
    [Description("24 Saat")]
    Daily = 1440,
    
    [Description("Haftalık")]
    Weekly = 10080
}

public enum AlertType
{
    [Description("Bilgi")]
    Info = 1,
    
    [Description("Uyarı")]
    Warning = 2,
    
    [Description("Hata")]
    Error = 3,
    
    [Description("Kritik")]
    Critical = 4,
    
    [Description("Başarı")]
    Success = 5
}

public enum CurrencyCode
{
    [Description("Türk Lirası")]
    TRY = 1,
    
    [Description("Amerikan Doları")]
    USD = 2,
    
    [Description("Euro")]
    EUR = 3,
    
    [Description("İngiliz Sterlini")]
    GBP = 4,
    
    [Description("Japon Yeni")]
    JPY = 5,
    
    [Description("İsviçre Frankı")]
    CHF = 6,
    
    [Description("Kanada Doları")]
    CAD = 7,
    
    [Description("Avustralya Doları")]
    AUD = 8,
    
    [Description("Rus Rublesi")]
    RUB = 9,
    
    [Description("Çin Yuanı")]
    CNY = 10
}