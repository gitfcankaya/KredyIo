using KredyIo.API.Models.Entities;
using KredyIo.API.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace KredyIo.API.Data;

public static class SeedData
{
    public static async Task InitializeAsync(ApplicationDbContext context)
    {
        // Ensure database is created
        await context.Database.EnsureCreatedAsync();

        // Seed all data
        // Seed Banks
        await SeedBanks(context);

        // Seed Loan Products
        await SeedLoanProducts(context);

        // Seed Credit Cards
        await SeedCreditCards(context);

        // Seed Deposit Rates
        await SeedDepositRates(context);

        // Seed Campaigns
        await SeedCampaigns(context);

        // Seed ContentArticles and FAQs
        await SeedContentArticles(context);
        await SeedFAQs(context);
        // Seed Articles and detailed FAQs
        await SeedArticles(context);
        await SeedFrequentlyAskedQuestions(context);
        // Seed Users, Settings, DepositProducts, CurrencyRates
        await SeedUsers(context);
        await SeedSystemSettings(context);
        await SeedDepositProducts(context);
        await SeedCurrencyRates(context);

        // Seed remaining entities
        await SeedGoldPrices(context);
        await SeedEconomicIndicators(context);
        await SeedNewsArticles(context);
        await SeedInvestmentProducts(context);

        await context.SaveChangesAsync();
    }

    private static async Task SeedGoldPrices(ApplicationDbContext context)
    {
        if (await context.GoldPrices.AnyAsync()) return;
        var goldPrices = new List<GoldPrice>
            {
                new GoldPrice { GoldType = "Gram Altın", BuyingPrice = 2450.50m, SellingPrice = 2455.75m, PreviousPrice = 2440.00m, ChangePercent = 0.43m, ChangeAmount = 10.50m, Source = "BigPara", PriceDate = DateTime.UtcNow },
                new GoldPrice { GoldType = "Çeyrek Altın", BuyingPrice = 4025.00m, SellingPrice = 4050.00m, PreviousPrice = 4000.00m, ChangePercent = 0.63m, ChangeAmount = 25.00m, Source = "BigPara", PriceDate = DateTime.UtcNow },
                new GoldPrice { GoldType = "Yarım Altın", BuyingPrice = 8020.00m, SellingPrice = 8080.00m, PreviousPrice = 7980.00m, ChangePercent = 0.50m, ChangeAmount = 40.00m, Source = "BigPara", PriceDate = DateTime.UtcNow },
                new GoldPrice { GoldType = "Tam Altın", BuyingPrice = 16100.00m, SellingPrice = 16200.00m, PreviousPrice = 16000.00m, ChangePercent = 0.63m, ChangeAmount = 100.00m, Source = "BigPara", PriceDate = DateTime.UtcNow },
                new GoldPrice { GoldType = "Cumhuriyet Altını", BuyingPrice = 16300.00m, SellingPrice = 16400.00m, PreviousPrice = 16200.00m, ChangePercent = 0.62m, ChangeAmount = 100.00m, Source = "BigPara", PriceDate = DateTime.UtcNow },
                new GoldPrice { GoldType = "Ata Altın", BuyingPrice = 17100.00m, SellingPrice = 17250.00m, PreviousPrice = 17000.00m, ChangePercent = 0.59m, ChangeAmount = 100.00m, Source = "BigPara", PriceDate = DateTime.UtcNow }
            };
        await context.GoldPrices.AddRangeAsync(goldPrices);
        await context.SaveChangesAsync();
    }

    private static async Task SeedEconomicIndicators(ApplicationDbContext context)
    {
        if (await context.EconomicIndicators.AnyAsync()) return;
        var indicators = new List<EconomicIndicator>
            {
                new EconomicIndicator { IndicatorCode = "ENFLASYON", IndicatorName = "Yıllık Enflasyon", Value = 61.53m, Unit = "%", Period = "Yıllık", PreviousValue = 64.77m, ChangePercent = -5.00m, Source = "TÜİK", DataDate = DateTime.UtcNow.AddMonths(-1) },
                new EconomicIndicator { IndicatorCode = "BUYUME", IndicatorName = "GSYİH Büyüme", Value = 4.5m, Unit = "%", Period = "Yıllık", PreviousValue = 5.1m, ChangePercent = -11.76m, Source = "TÜİK", DataDate = DateTime.UtcNow.AddMonths(-3) },
                new EconomicIndicator { IndicatorCode = "FAIZ", IndicatorName = "Politika Faizi", Value = 50.00m, Unit = "%", Period = "Yıllık", PreviousValue = 45.00m, ChangePercent = 11.11m, Source = "TCMB", DataDate = DateTime.UtcNow },
                new EconomicIndicator { IndicatorCode = "ISSIZLIK", IndicatorName = "İşsizlik Oranı", Value = 9.2m, Unit = "%", Period = "Aylık", PreviousValue = 9.4m, ChangePercent = -2.13m, Source = "TÜİK", DataDate = DateTime.UtcNow.AddMonths(-1) },
                new EconomicIndicator { IndicatorCode = "CARIACIK", IndicatorName = "Cari Açık", Value = -24.5m, Unit = "Milyar USD", Period = "Yıllık", PreviousValue = -45.2m, ChangePercent = -45.80m, Source = "TCMB", DataDate = DateTime.UtcNow.AddMonths(-1) }
            };
        await context.EconomicIndicators.AddRangeAsync(indicators);
        await context.SaveChangesAsync();
    }

    private static async Task SeedNewsArticles(ApplicationDbContext context)
    {
        if (await context.NewsArticles.AnyAsync()) return;
        var newsArticles = new List<NewsArticle>
            {
                new NewsArticle { Title = "TCMB Faiz Kararını Açıkladı", Summary = "Merkez Bankası politika faizini %50'de sabit tutma kararı aldı.", Content = "Türkiye Cumhuriyet Merkez Bankası, Para Politikası Kurulu toplantısında politika faizini %50 seviyesinde sabit tutma kararı aldı. Kararda enflasyondaki düşüş trendi vurgulandı.", SourceUrl = "https://example.com/news/tcmb-faiz", Source = "Bloomberg HT", Author = "Ekonomi Editörü", ImageUrl = "/images/news/tcmb-faiz.jpg", Tags = "[\"TCMB\", \"Faiz\", \"Ekonomi\"]", Category = "Ekonomi", PublishedAt = DateTime.UtcNow.AddHours(-5), IsActive = true, ViewCount = 0 },
                new NewsArticle { Title = "Altın Fiyatlarında Rekor Artış", Summary = "Gram altın 2500 TL'yi aştı, yatırımcılar altına yöneldi.", Content = "Küresel piyasalardaki belirsizlikler ve döviz kurundaki hareketlilik nedeniyle altın fiyatları rekor seviyelere ulaştı. Gram altın tarihi zirvesini gördü.", SourceUrl = "https://example.com/news/altin-rekor", Source = "Ekonomist", Author = "Piyasa Editörü", ImageUrl = "/images/news/altin-rekor.jpg", Tags = "[\"Altın\", \"Yatırım\"]", Category = "Piyasalar", PublishedAt = DateTime.UtcNow.AddHours(-12), IsActive = true, ViewCount = 0 },
                new NewsArticle { Title = "Bankalar Kredi Faizlerini İndirdi", Summary = "Konut kredisi faiz oranlarında düşüş başladı.", Content = "Birçok banka konut kredisi faiz oranlarında indirime gitti. İhtiyaç kredisi faizlerinde de düşüş bekleniyor.", SourceUrl = "https://example.com/news/kredi-faiz-dusus", Source = "Hürriyet", Author = "Finans Muhabiri", ImageUrl = "/images/news/kredi-faiz.jpg", Tags = "[\"Kredi\", \"Faiz\", \"Bankalar\"]", Category = "Bankacılık", PublishedAt = DateTime.UtcNow.AddDays(-1), IsActive = true, ViewCount = 0 }
            };
        await context.NewsArticles.AddRangeAsync(newsArticles);
        await context.SaveChangesAsync();
    }

    private static async Task SeedInvestmentProducts(ApplicationDbContext context)
    {
        if (await context.InvestmentProducts.AnyAsync()) return;
        var now = DateTime.UtcNow;
        var investmentProducts = new List<InvestmentProduct>
            {
                new InvestmentProduct {
                    Name = "İş Bankası Hisse Senedi",
                    Symbol = "ISCTR",
                    Type = InvestmentType.HisseSenedi,
                    CurrentPrice = 15.75m,
                    DailyChange = 0.35m,
                    DailyChangePercent = 2.27m,
                    Volume = 125000000,
                    HighPrice = 15.95m,
                    LowPrice = 15.50m,
                    OpenPrice = 15.60m,
                    IsActive = true,
                    CreatedDate = now,
                    UpdatedDate = now
                },
                new InvestmentProduct {
                    Name = "Garanti BBVA Hisse Senedi",
                    Symbol = "GARAN",
                    Type = InvestmentType.HisseSenedi,
                    CurrentPrice = 102.50m,
                    DailyChange = -1.25m,
                    DailyChangePercent = -1.20m,
                    Volume = 95000000,
                    HighPrice = 104.00m,
                    LowPrice = 102.00m,
                    OpenPrice = 103.75m,
                    IsActive = true,
                    CreatedDate = now,
                    UpdatedDate = now
                },
                new InvestmentProduct {
                    Name = "Akbank Hisse Senedi",
                    Symbol = "AKBNK",
                    Type = InvestmentType.HisseSenedi,
                    CurrentPrice = 58.25m,
                    DailyChange = 1.10m,
                    DailyChangePercent = 1.93m,
                    Volume = 180000000,
                    HighPrice = 58.50m,
                    LowPrice = 57.15m,
                    OpenPrice = 57.15m,
                    IsActive = true,
                    CreatedDate = now,
                    UpdatedDate = now
                },
                new InvestmentProduct {
                    Name = "Yapı Kredi Hisse Senedi",
                    Symbol = "YKBNK",
                    Type = InvestmentType.HisseSenedi,
                    CurrentPrice = 35.40m,
                    DailyChange = 0.80m,
                    DailyChangePercent = 2.31m,
                    Volume = 140000000,
                    HighPrice = 35.60m,
                    LowPrice = 34.60m,
                    OpenPrice = 34.60m,
                    IsActive = true,
                    CreatedDate = now,
                    UpdatedDate = now
                }
            };
        await context.InvestmentProducts.AddRangeAsync(investmentProducts);
        await context.SaveChangesAsync();
    }

    private static async Task SeedBanks(ApplicationDbContext context)
    {
        var banks = new List<Bank>
        {
            new Bank { Name = "Garanti BBVA", Code = "GARANTI", LogoUrl = "/logos/garanti.png", IsActive = true, Rating = 4.5m, CustomerCount = 18500000 },
            new Bank { Name = "İş Bankası", Code = "ISBANK", LogoUrl = "/logos/isbank.png", IsActive = true, Rating = 4.6m, CustomerCount = 22000000 },
            new Bank { Name = "Yapı Kredi", Code = "YAPIKREDI", LogoUrl = "/logos/yapikredi.png", IsActive = true, Rating = 4.4m, CustomerCount = 16500000 },
            new Bank { Name = "Akbank", Code = "AKBANK", LogoUrl = "/logos/akbank.png", IsActive = true, Rating = 4.7m, CustomerCount = 19000000 },
            new Bank { Name = "Ziraat Bankası", Code = "ZIRAAT", LogoUrl = "/logos/ziraat.png", IsActive = true, Rating = 4.3m, CustomerCount = 24000000 },
            new Bank { Name = "Halkbank", Code = "HALKBANK", LogoUrl = "/logos/halkbank.png", IsActive = true, Rating = 4.2m, CustomerCount = 15000000 },
            new Bank { Name = "Vakıfbank", Code = "VAKIFBANK", LogoUrl = "/logos/vakifbank.png", IsActive = true, Rating = 4.4m, CustomerCount = 17000000 },
            new Bank { Name = "QNB Finansbank", Code = "FINANSBANK", LogoUrl = "/logos/finansbank.png", IsActive = true, Rating = 4.3m, CustomerCount = 8500000 },
            new Bank { Name = "TEB", Code = "TEB", LogoUrl = "/logos/teb.png", IsActive = true, Rating = 4.2m, CustomerCount = 6000000 },
            new Bank { Name = "Denizbank", Code = "DENIZBANK", LogoUrl = "/logos/denizbank.png", IsActive = true, Rating = 4.1m, CustomerCount = 7500000 },
            new Bank { Name = "ING", Code = "ING", LogoUrl = "/logos/ing.png", IsActive = true, Rating = 4.5m, CustomerCount = 4500000 },
            new Bank { Name = "HSBC", Code = "HSBC", LogoUrl = "/logos/hsbc.png", IsActive = true, Rating = 4.4m, CustomerCount = 3000000 },
            new Bank { Name = "Fibabanka", Code = "FIBABANKA", LogoUrl = "/logos/fibabanka.png", IsActive = true, Rating = 4.0m, CustomerCount = 2500000 },
            new Bank { Name = "Odeabank", Code = "ODEABANK", LogoUrl = "/logos/odeabank.png", IsActive = true, Rating = 3.9m, CustomerCount = 2000000 },
            new Bank { Name = "Alternatifbank", Code = "ALTERNATIF", LogoUrl = "/logos/alternatifbank.png", IsActive = true, Rating = 4.1m, CustomerCount = 2800000 }
        };

        await context.Banks.AddRangeAsync(banks);
        await context.SaveChangesAsync();
    }

    private static async Task SeedLoanProducts(ApplicationDbContext context)
    {
        var banks = await context.Banks.ToListAsync();
        var loanProducts = new List<LoanProduct>();

        var loanTypes = new[] { "İhtiyaç Kredisi", "Konut Kredisi", "Taşıt Kredisi", "Emekli Kredisi" };
        var purposes = new[] { "Serbest Kullanım", "Ev Alımı", "Araç Alımı", "Emekli Maaşına" };

        for (int i = 0; i < banks.Count; i++)
        {
            var bank = banks[i];

            // İhtiyaç Kredisi
            loanProducts.Add(new LoanProduct
            {
                Name = $"{bank.Name} İhtiyaç Kredisi",
                BankId = bank.Id,
                LoanType = "İhtiyaç Kredisi",
                MinInterestRate = 2.49m + (i * 0.1m),
                MaxInterestRate = 4.99m + (i * 0.1m),
                MinAmount = 5000,
                MaxAmount = 500000,
                MinTerm = 3,
                MaxTerm = 60,
                Purpose = "Serbest Kullanım",
                RequiresCollateral = false,
                RequiresGuarantor = false,
                MaxAge = 70,
                MinAge = 22,
                Features = "Hızlı onay, Masrafsız, Online başvuru",
                IsActive = true,
                IsFeatured = i < 3
            });

            // Konut Kredisi
            loanProducts.Add(new LoanProduct
            {
                Name = $"{bank.Name} Konut Kredisi",
                BankId = bank.Id,
                LoanType = "Konut Kredisi",
                MinInterestRate = 1.89m + (i * 0.05m),
                MaxInterestRate = 3.49m + (i * 0.05m),
                MinAmount = 100000,
                MaxAmount = 5000000,
                MinTerm = 12,
                MaxTerm = 240,
                Purpose = "Ev Alımı",
                RequiresCollateral = true,
                RequiresGuarantor = false,
                MaxAge = 70,
                MinAge = 22,
                Features = "Düşük faiz, Uzun vade, Uygun taksit",
                IsActive = true,
                IsFeatured = i < 2
            });

            // Taşıt Kredisi
            loanProducts.Add(new LoanProduct
            {
                Name = $"{bank.Name} Taşıt Kredisi",
                BankId = bank.Id,
                LoanType = "Taşıt Kredisi",
                MinInterestRate = 2.19m + (i * 0.08m),
                MaxInterestRate = 3.99m + (i * 0.08m),
                MinAmount = 50000,
                MaxAmount = 2000000,
                MinTerm = 6,
                MaxTerm = 60,
                Purpose = "Araç Alımı",
                RequiresCollateral = true,
                RequiresGuarantor = false,
                MaxAge = 68,
                MinAge = 21,
                Features = "İkinci el destekli, Uygun faiz, Esnek ödeme",
                IsActive = true,
                IsFeatured = i < 2
            });

            // Emekli Kredisi
            if (i % 2 == 0)
            {
                loanProducts.Add(new LoanProduct
                {
                    Name = $"{bank.Name} Emekli Kredisi",
                    BankId = bank.Id,
                    LoanType = "Emekli Kredisi",
                    MinInterestRate = 2.29m + (i * 0.07m),
                    MaxInterestRate = 4.49m + (i * 0.07m),
                    MinAmount = 5000,
                    MaxAmount = 300000,
                    MinTerm = 3,
                    MaxTerm = 48,
                    Purpose = "Emekli Maaşına",
                    RequiresCollateral = false,
                    RequiresGuarantor = false,
                    MaxAge = 80,
                    MinAge = 55,
                    Features = "Emeklilere özel, Avantajlı faiz, Hızlı onay",
                    IsActive = true,
                    IsFeatured = i == 0
                });
            }
        }

        await context.LoanProducts.AddRangeAsync(loanProducts);
        await context.SaveChangesAsync();
    }

    private static async Task SeedCreditCards(ApplicationDbContext context)
    {
        if (await context.CreditCardProducts.AnyAsync()) return;
        var banks = await context.Banks.ToListAsync();
        var creditCards = new List<CreditCardProduct>();

        var cardTypes = new[] { "World", "Platinum", "Gold", "Classic" };
        var categories = new[] { "Mil", "Puan", "Alışveriş", "Cashback" };

        for (int i = 0; i < banks.Count; i++)
        {
            var bank = banks[i];

            // World Card
            creditCards.Add(new CreditCardProduct
            {
                BankId = bank.Id,
                CardName = $"{bank.Name} World Card",
                Category = "Mil",
                AnnualFee = 750 + (i * 50),
                IsFirstYearFree = false,
                HasWelcomeBonus = true,
                WelcomeBonusAmount = 50000,
                HasAirlineMiles = true,
                MilesPerTL = 2.5m + (i * 0.1m),
                HasPoints = false,
                HasCashback = false,
                HasShoppingDiscount = false,
                HasFuelDiscount = false,
                Features = "Premium hizmetler",
                Advantages = "Havalimanı loungeları, Sınırsız mil",
                IsActive = true,
                IsPromoted = i < 3
            });

            // Platinum Card
            creditCards.Add(new CreditCardProduct
            {
                BankId = bank.Id,
                CardName = $"{bank.Name} Platinum Kart",
                Category = "Puan",
                AnnualFee = 0,
                IsFirstYearFree = true,
                HasWelcomeBonus = true,
                WelcomeBonusAmount = 10000,
                HasAirlineMiles = false,
                HasPoints = true,
                PointsPerTL = 1.5m + (i * 0.05m),
                HasCashback = false,
                HasShoppingDiscount = true,
                HasFuelDiscount = false,
                Features = "Online alışveriş, Kampanyalı taksit",
                Advantages = "Puan kazanımı",
                IsActive = true,
                IsPromoted = i < 5
            });

            // Cashback Card
            if (i % 3 == 0)
            {
                creditCards.Add(new CreditCardProduct
                {
                    BankId = bank.Id,
                    CardName = $"{bank.Name} Cashback Kart",
                    Category = "Cashback",
                    AnnualFee = 0,
                    IsFirstYearFree = true,
                    HasWelcomeBonus = false,
                    HasAirlineMiles = false,
                    HasPoints = false,
                    HasCashback = true,
                    CashbackRate = 2.5m + (i * 0.2m),
                    HasShoppingDiscount = false,
                    HasFuelDiscount = false,
                    Features = "Para iadesi, Kampanyalı harcama",
                    Advantages = "Ücretsiz kart",
                    IsActive = true,
                    IsPromoted = i == 0
                });
            }
        }

        await context.CreditCardProducts.AddRangeAsync(creditCards);
        await context.SaveChangesAsync();
    }

    private static async Task SeedDepositRates(ApplicationDbContext context)
    {
        var banks = await context.Banks.ToListAsync();
        var depositRates = new List<DepositRate>();

        var terms = new[] { 1, 3, 6, 9, 12, 18, 24, 36 };
        var currencies = new[] { "TRY", "USD", "EUR" };

        foreach (var bank in banks)
        {
            foreach (var term in terms)
            {
                // TRY
                depositRates.Add(new DepositRate
                {
                    BankId = bank.Id,
                    Currency = "TRY",
                    TermMonths = term,
                    InterestRate = 45.5m - (term * 0.5m) + (banks.IndexOf(bank) * 0.2m),
                    MinAmount = 1000,
                    MaxAmount = 10000000,
                    HasCampaign = term <= 6 && banks.IndexOf(bank) < 5,
                    CampaignDetails = term <= 6 && banks.IndexOf(bank) < 5 ? $"Kampanya: {48.5m - (term * 0.4m)}% (sınırlı süre)" : null,
                    IsActive = true,
                    EffectiveDate = DateTime.UtcNow.AddDays(-7)
                });

                // USD
                depositRates.Add(new DepositRate
                {
                    BankId = bank.Id,
                    Currency = "USD",
                    TermMonths = term,
                    InterestRate = 4.5m - (term * 0.05m) + (banks.IndexOf(bank) * 0.02m),
                    MinAmount = 100,
                    MaxAmount = 1000000,
                    HasCampaign = term == 12 && banks.IndexOf(bank) < 3,
                    CampaignDetails = term == 12 && banks.IndexOf(bank) < 3 ? "Yıllık özel kampanya: %5" : null,
                    IsActive = true,
                    EffectiveDate = DateTime.UtcNow.AddDays(-7)
                });

                // EUR
                depositRates.Add(new DepositRate
                {
                    BankId = bank.Id,
                    Currency = "EUR",
                    TermMonths = term,
                    InterestRate = 3.5m - (term * 0.04m) + (banks.IndexOf(bank) * 0.02m),
                    MinAmount = 100,
                    MaxAmount = 1000000,
                    HasCampaign = false,
                    IsActive = true,
                    EffectiveDate = DateTime.UtcNow.AddDays(-7)
                });
            }
        }

        await context.DepositRates.AddRangeAsync(depositRates);
        await context.SaveChangesAsync();
    }

    private static async Task SeedCampaigns(ApplicationDbContext context)
    {
        var banks = await context.Banks.ToListAsync();
        var campaigns = new List<Campaign>();

        var campaignTitles = new[]
        {
            "Yeni Müşterilere Özel Faiz İndirimi",
            "Mevduatta Yüksek Faiz Fırsatı",
            "Kredi Kartı Hoş Geldin Bonusu",
            "Konut Kredisinde %50 İndirim",
            "Taşıt Kredisinde Özel Kampanya",
            "Mil Kazanma Fırsatı",
            "Emeklilere Özel Avantajlar",
            "Online Başvuruda Ek İndirim"
        };

        for (int i = 0; i < banks.Count; i++)
        {
            var bank = banks[i];

            // Loan Campaign
            campaigns.Add(new Campaign
            {
                BankId = bank.Id,
                Title = campaignTitles[i % campaignTitles.Length],
                Description = $"{bank.Name} müşterilerine özel {campaignTitles[i % campaignTitles.Length].ToLower()} kampanyası",
                CampaignType = "Kredi",
                DiscountRate = 0.5m + (i * 0.1m),
                BonusAmount = null,
                StartDate = DateTime.UtcNow.AddDays(-10),
                EndDate = DateTime.UtcNow.AddMonths(2),
                Conditions = "Hedef: Yeni müşteriler. Kampanya koşulları için banka şubesine başvurunuz",
                ImageUrl = $"/campaigns/campaign-{i + 1}.jpg",
                IsFeatured = i < 5,
                IsActive = true
            });

            // Credit Card Campaign
            if (i % 2 == 0)
            {
                campaigns.Add(new Campaign
                {
                    BankId = bank.Id,
                    Title = $"{bank.Name} Kredi Kartı Bonusu",
                    Description = "Yeni kredi kartı başvurularında hoş geldin bonusu kazanın",
                    CampaignType = "Kredi Kartı",
                    DiscountRate = null,
                    BonusAmount = 1000 + (i * 100),
                    StartDate = DateTime.UtcNow.AddDays(-5),
                    EndDate = DateTime.UtcNow.AddMonths(3),
                    Conditions = "Tüm müşterilere açıktır. Bonus tutarı ilk 3 ay içinde yatırılacaktır.",
                    ImageUrl = $"/campaigns/card-campaign-{i + 1}.jpg",
                    IsFeatured = i < 3,
                    IsActive = true
                });
            }

            // Deposit Campaign
            if (i % 3 == 0)
            {
                campaigns.Add(new Campaign
                {
                    BankId = bank.Id,
                    Title = "Mevduatta Rekor Faiz",
                    Description = "6 aylık vadeli mevduatta %48.5 faiz fırsatı",
                    CampaignType = "Mevduat",
                    DiscountRate = 3.0m,
                    BonusAmount = null,
                    StartDate = DateTime.UtcNow.AddDays(-15),
                    EndDate = DateTime.UtcNow.AddMonths(1),
                    Conditions = "Minimum 10.000 TL tutarında açılacak vadeli mevduat hesapları için geçerlidir",
                    ImageUrl = $"/campaigns/deposit-campaign-{i + 1}.jpg",
                    IsFeatured = i == 0,
                    IsActive = true
                });
            }
        }

        await context.Campaigns.AddRangeAsync(campaigns);
        await context.SaveChangesAsync();
    }

    private static async Task SeedContentArticles(ApplicationDbContext context)
    {
        if (await context.ContentArticles.AnyAsync()) return;

        var articles = new List<ContentArticle>
        {
            new ContentArticle
            {
                Title = "Kredi Başvurusu Yaparken Dikkat Edilmesi Gerekenler",
                Slug = "kredi-basvurusu-yaparken-dikkat-edilmesi-gerekenler",
                Category = "Krediler",
                Content = "Kredi başvurusu yaparken dikkat etmeniz gereken önemli noktalar...",
                Author = "KredyIo Editör",
                IsFeatured = true,
                FeaturedImageUrl = "/images/articles/loan-application.jpg",
                PublishedAt = DateTime.UtcNow.AddDays(-15),
                IsPublished = true
            },
            new ContentArticle
            {
                Title = "En Uygun Kredi Kartı Nasıl Seçilir?",
                Slug = "en-uygun-kredi-karti-nasil-secilir",
                Category = "Kredi Kartları",
                Content = "İhtiyaçlarınıza uygun kredi kartını seçmek için rehber...",
                Author = "KredyIo Editör",
                IsFeatured = true,
                FeaturedImageUrl = "/images/articles/credit-card-guide.jpg",
                PublishedAt = DateTime.UtcNow.AddDays(-10),
                IsPublished = true
            }
        };

        await context.ContentArticles.AddRangeAsync(articles);
        await context.SaveChangesAsync();
    }

    private static async Task SeedFAQs(ApplicationDbContext context)
    {
        if (await context.FAQs.AnyAsync()) return;

        var faqs = new List<FAQ>
        {
            new FAQ { Category = "Genel", Question = "KredyIo nedir?", Answer = "KredyIo, Türkiye'deki bankaların ürünlerini karşılaştıran bir platformdur.", SortOrder = 1, IsActive = true },
            new FAQ { Category = "Genel", Question = "Başvuru yapabilir miyim?", Answer = "Evet, karşılaştırma sonrası bankaya yönlendirilirsiniz.", SortOrder = 2, IsActive = true },
            new FAQ { Category = "Krediler", Question = "Kredi başvurusu ne kadar sürer?", Answer = "Genellikle bankalar 1-3 iş günü içinde yanıt verir.", SortOrder = 3, IsActive = true }
        };

        await context.FAQs.AddRangeAsync(faqs);
        await context.SaveChangesAsync();
    }

    private static async Task SeedUsers(ApplicationDbContext context)
    {
        if (await context.Users.AnyAsync()) return;
        var users = new List<User>
        {
            new User { Email = "admin@kredyio.com", PasswordHash = "hashed_password", FirstName = "Admin", LastName = "User", Role = UserRole.Admin, IsActive = true, EmailVerified = true }
        };
        await context.Users.AddRangeAsync(users);
        await context.SaveChangesAsync();
    }

    private static async Task SeedSystemSettings(ApplicationDbContext context)
    {
        if (await context.SystemSettings.AnyAsync()) return;
        var settings = new List<SystemSetting>
        {
            new SystemSetting { Key = "SiteTitle", Value = "KredyIo", Description = "Website Title", Category = "General", DataType = "string", IsRequired = true, SortOrder = 1 },
            new SystemSetting { Key = "DefaultCurrency", Value = "TRY", Description = "Default Currency Code", Category = "General", DataType = "string", IsRequired = true, SortOrder = 2 },
            new SystemSetting { Key = "ItemsPerPage", Value = "20", Description = "Items Per Page", Category = "General", DataType = "int", IsRequired = true, SortOrder = 3 }
        };
        await context.SystemSettings.AddRangeAsync(settings);
        await context.SaveChangesAsync();
    }

    private static async Task SeedDepositProducts(ApplicationDbContext context)
    {
        if (await context.DepositProducts.AnyAsync()) return;
        var banks = await context.Banks.ToListAsync();
        var depositProducts = new List<DepositProduct>();
        foreach (var bank in banks)
        {
            depositProducts.Add(new DepositProduct
            {
                Name = $"{bank.Name} Vadesiz Mevduat",
                BankId = bank.Id,
                Type = DepositType.VadesizMevduat,
                InterestRate = 0.5m,
                MinimumAmount = 1000,
                MaximumAmount = 10000000,
                Currency = "TRY",
                Description = "Vadesiz mevduat hesabı",
                Features = "Hesabınızı her zaman kullanabilirsiniz",
                IsActive = true
            });
            depositProducts.Add(new DepositProduct
            {
                Name = $"{bank.Name} Vadeli Mevduat",
                BankId = bank.Id,
                Type = DepositType.VadeliMevduat,
                InterestRate = 15.0m,
                MinimumAmount = 1000,
                MaximumAmount = 10000000,
                MinimumTerm = 30,
                MaximumTerm = 365,
                Currency = "TRY",
                Description = "Vadeli mevduat hesabı",
                Features = "Daha yüksek faiz oranı",
                IsActive = true
            });
        }
        await context.DepositProducts.AddRangeAsync(depositProducts);
        await context.SaveChangesAsync();
    }

    private static async Task SeedCurrencyRates(ApplicationDbContext context)
    {
        if (await context.CurrencyRates.AnyAsync()) return;
        var rates = new List<CurrencyRate>
        {
            new CurrencyRate { CurrencyCode = "USD", CurrencyName = "US Dollar", BuyingRate = 27.5m, SellingRate = 27.7m, Source = "TCMB", RateDate = DateTime.UtcNow },
            new CurrencyRate { CurrencyCode = "EUR", CurrencyName = "Euro", BuyingRate = 30.0m, SellingRate = 30.2m, Source = "TCMB", RateDate = DateTime.UtcNow },
            new CurrencyRate { CurrencyCode = "GBP", CurrencyName = "British Pound", BuyingRate = 35.0m, SellingRate = 35.2m, Source = "TCMB", RateDate = DateTime.UtcNow }
        };
        await context.CurrencyRates.AddRangeAsync(rates);
        await context.SaveChangesAsync();
    }

    private static async Task SeedArticles(ApplicationDbContext context)
    {
        if (await context.Articles.AnyAsync()) return;
        var articles = new List<Article>
        {
            new Article { Title = "Aidatsız Kredi Kartları Nelerdir?", Slug = "aidatsiz-kredi-kartlari-nelerdir", Summary = "Ücret ödemeden kullanabileceğiniz kredi kartı seçeneklerini keşfedin.", Content = "Aidatsız kredi kartları, yıllık veya aylık ücret talep etmeyen kartlardır. Bankalar çeşitli kampanya ve avantajlarla bu kartları sunar.", Category = "KrediKartları", Tags = "[\"kredi kartı\", \"aidatsiz\"]", FeaturedImage = "/images/articles/aidatsiz-kartlar.jpg", Author = "KredyIo Editör", IsPublished = true, IsFeatured = true, ViewCount = 0, PublishedAt = DateTime.UtcNow.AddDays(-20) },
            new Article { Title = "Altın Fiyatları Nasıl Hesaplanır?", Slug = "altin-fiyatlari-nasil-hesaplanir", Summary = "Altın fiyatlarını etkileyen faktörleri ve hesaplama yöntemlerini öğrenin.", Content = "Altın fiyatları arz-talep dengesi, döviz kurları ve küresel piyasa hareketlerinden etkilenir. Gram altın, çeyrek altın gibi farklı türlerin fiyatları değişkenlik gösterir.", Category = "Yatırım", Tags = "[\"altın\", \"yatırım\"]", FeaturedImage = "/images/articles/altin-fiyatlari.jpg", Author = "KredyIo Ekonomi Ekibi", IsPublished = true, IsFeatured = false, ViewCount = 0, PublishedAt = DateTime.UtcNow.AddDays(-15) },
            new Article { Title = "Mevduat Faiz Oranları 2025", Slug = "mevduat-faiz-oranlari-2025", Summary = "2025 yılı için güncel mevduat faiz oranlarını karşılaştırın.", Content = "Bankalar vadeli ve vadesiz mevduat ürünlerinde farklı oranlar sunar. 3 aylık, 6 aylık ve 12 aylık vadeler için oranları inceleyin.", Category = "Mevduat", Tags = "[\"mevduat\", \"faiz\"]", FeaturedImage = "/images/articles/mevduat-faiz-oranlari.jpg", Author = "KredyIo Finans Departmanı", IsPublished = true, IsFeatured = false, ViewCount = 0, PublishedAt = DateTime.UtcNow.AddDays(-10) }
        };
        await context.Articles.AddRangeAsync(articles);
        await context.SaveChangesAsync();
    }

    private static async Task SeedFrequentlyAskedQuestions(ApplicationDbContext context)
    {
        if (await context.FrequentlyAskedQuestions.AnyAsync()) return;
        var faqs = new List<FrequentlyAskedQuestion>
        {
            new FrequentlyAskedQuestion { Category = "KrediKartları", Question = "Aidatsız kredi kartı nedir?", Answer = "Aidatsiz kredi kartı, yıllık kart ücreti alınmayan kart türüdür.", DisplayOrder = 1, IsActive = true },
            new FrequentlyAskedQuestion { Category = "Mevduat", Question = "Vadeli mevduat nasıl çalışır?", Answer = "Vadeli mevduatta belirlenen süre sonunda faiziyle birlikte ana paranız ödenir.", DisplayOrder = 2, IsActive = true },
            new FrequentlyAskedQuestion { Category = "Yatırım", Question = "Altın yatırımı yaparken nelere dikkat edilmeli?", Answer = "Altın yatırımı yapmadan önce purity (saflık), saklama maliyeti ve piyasa koşullarını değerlendirin.", DisplayOrder = 3, IsActive = true },
            new FrequentlyAskedQuestion { Category = "Döviz", Question = "Döviz kurları neden değişir?", Answer = "Döviz kurları arz-talep, merkez bankası politikaları ve ekonomik verilerle dalgalanır.", DisplayOrder = 4, IsActive = true },
            new FrequentlyAskedQuestion { Category = "Kredi", Question = "Kredi notu nasıl hesaplanır?", Answer = "Kredi notu gelir, ödeme geçmişi ve mevcut borç durumuna göre belirlenir.", DisplayOrder = 5, IsActive = true }
        };
        await context.FrequentlyAskedQuestions.AddRangeAsync(faqs);
        await context.SaveChangesAsync();
    }
}
