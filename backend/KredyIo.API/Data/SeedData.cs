using KredyIo.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace KredyIo.API.Data;

public static class SeedData
{
    public static async Task InitializeAsync(ApplicationDbContext context)
    {
        // Ensure database is created
        await context.Database.EnsureCreatedAsync();

        // Check if data already exists
        if (await context.Banks.AnyAsync())
        {
            return; // Database has been seeded
        }

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
        var banks = await context.Banks.ToListAsync();
        var creditCards = new List<CreditCardProduct>();

        var cardTypes = new[] { "World", "Platinum", "Gold", "Classic" };
        var categories = new[] { "Mil", "Puan", "Alışveriş", "Cashback" };

        for (int i = 0; i < banks.Count; i++)
        {
            var bank = banks[i];

            // Premium Card
            creditCards.Add(new CreditCardProduct
            {
                Name = $"{bank.Name} World Card",
                BankId = bank.Id,
                CardType = "World",
                CardCategory = "Mil",
                AnnualFee = 750 + (i * 50),
                CashbackRate = 0,
                MilesPerTL = 2.5m + (i * 0.1m),
                PointsPerTL = 0,
                WelcomeBonusAmount = 50000,
                WelcomeBonusType = "Mil",
                BenefitsSummary = "Havalimanı loungeları, Sınırsız mil, Premium hizmetler",
                AnnualSpendRequirement = 100000,
                MinCreditLimit = 15000,
                MaxCreditLimit = 100000,
                IsContactless = true,
                IsVirtual = true,
                HasInsurance = true,
                HasConcierge = true,
                MaxInstallments = 12,
                IsActive = true,
                IsFeatured = i < 3
            });

            // Standard Card
            creditCards.Add(new CreditCardProduct
            {
                Name = $"{bank.Name} Platinum Kart",
                BankId = bank.Id,
                CardType = "Platinum",
                CardCategory = "Puan",
                AnnualFee = 0,
                CashbackRate = 0,
                MilesPerTL = 0,
                PointsPerTL = 1.5m + (i * 0.05m),
                WelcomeBonusAmount = 10000,
                WelcomeBonusType = "Puan",
                BenefitsSummary = "Puan kazanımı, Online alışveriş, Kampanyalı taksit",
                AnnualSpendRequirement = 0,
                MinCreditLimit = 5000,
                MaxCreditLimit = 50000,
                IsContactless = true,
                IsVirtual = true,
                HasInsurance = true,
                HasConcierge = false,
                MaxInstallments = 9,
                IsActive = true,
                IsFeatured = i < 5
            });

            // Cashback Card
            if (i % 3 == 0)
            {
                creditCards.Add(new CreditCardProduct
                {
                    Name = $"{bank.Name} Cashback Kart",
                    BankId = bank.Id,
                    CardType = "Gold",
                    CardCategory = "Cashback",
                    AnnualFee = 0,
                    CashbackRate = 2.5m + (i * 0.2m),
                    MilesPerTL = 0,
                    PointsPerTL = 0,
                    WelcomeBonusAmount = 500,
                    WelcomeBonusType = "Cashback",
                    BenefitsSummary = "Para iadesi, Kampanyalı harcama, Ücretsiz kart",
                    AnnualSpendRequirement = 0,
                    MinCreditLimit = 3000,
                    MaxCreditLimit = 30000,
                    IsContactless = true,
                    IsVirtual = false,
                    HasInsurance = false,
                    HasConcierge = false,
                    MaxInstallments = 6,
                    IsActive = true,
                    IsFeatured = i == 0
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
                    CampaignRate = term <= 6 && banks.IndexOf(bank) < 5 ? 48.5m - (term * 0.4m) : null,
                    CampaignEndDate = term <= 6 ? DateTime.UtcNow.AddMonths(2) : null,
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
                    CampaignRate = term == 12 && banks.IndexOf(bank) < 3 ? 5.0m : null,
                    CampaignEndDate = term == 12 ? DateTime.UtcNow.AddMonths(1) : null,
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
                TargetAudience = "Yeni Müşteriler",
                Terms = "Kampanya koşulları için banka şubesine başvurunuz",
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
                    TargetAudience = "Tüm Müşteriler",
                    Terms = "Bonus tutarı ilk 3 ay içinde hesabınıza yatırılacaktır",
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
                    TargetAudience = "Tüm Müşteriler",
                    Terms = "Minimum 10.000 TL tutarında açılacak vadeli mevduat hesapları için geçerlidir",
                    ImageUrl = $"/campaigns/deposit-campaign-{i + 1}.jpg",
                    IsFeatured = i == 0,
                    IsActive = true
                });
            }
        }

        await context.Campaigns.AddRangeAsync(campaigns);
        await context.SaveChangesAsync();
    }
}
