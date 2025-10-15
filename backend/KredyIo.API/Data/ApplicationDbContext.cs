using Microsoft.EntityFrameworkCore;
using KredyIo.API.Models.Entities;

namespace KredyIo.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // Existing
    public DbSet<Product> Products { get; set; }
    
    // New entities
    public DbSet<Bank> Banks { get; set; }
    public DbSet<DepositProduct> DepositProducts { get; set; }
    public DbSet<CreditCard> CreditCards { get; set; }
    public DbSet<InvestmentProduct> InvestmentProducts { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<UserFavorite> UserFavorites { get; set; }
    public DbSet<UserComparison> UserComparisons { get; set; }
    public DbSet<Article> Articles { get; set; }
    public DbSet<NewsItem> NewsItems { get; set; }
    public DbSet<FAQ> FAQs { get; set; }
    public DbSet<ScrapingJob> ScrapingJobs { get; set; }
    public DbSet<ScrapingJobLog> ScrapingJobLogs { get; set; }
    public DbSet<SystemSetting> SystemSettings { get; set; }
    
    // Scraping data entities
    public DbSet<ScrapingResult> ScrapingResults { get; set; }
    public DbSet<CurrencyRate> CurrencyRates { get; set; }
    public DbSet<GoldPrice> GoldPrices { get; set; }
    public DbSet<StockData> StockData { get; set; }
    public DbSet<NewsArticle> NewsArticles { get; set; }
    public DbSet<EconomicIndicator> EconomicIndicators { get; set; }
    
    // New comprehensive entities
    public DbSet<LoanProduct> LoanProducts { get; set; }
    public DbSet<CreditCardProduct> CreditCardProducts { get; set; }
    public DbSet<DepositRate> DepositRates { get; set; }
    public DbSet<Campaign> Campaigns { get; set; }
    public DbSet<ContentArticle> ContentArticles { get; set; }
    public DbSet<FrequentlyAskedQuestion> FrequentlyAskedQuestions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure existing Product entity
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.LenderName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.ProductName).IsRequired().HasMaxLength(300);
            entity.Property(e => e.InterestRate).HasPrecision(18, 4);
            entity.Property(e => e.MinAmount).HasPrecision(18, 2);
            entity.Property(e => e.MaxAmount).HasPrecision(18, 2);
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.UpdatedAt).IsRequired();
            entity.Property(e => e.IsActive).IsRequired().HasDefaultValue(true);

            entity.HasIndex(e => e.Type);
            entity.HasIndex(e => e.LenderName);
            entity.HasIndex(e => e.InterestRate);
            entity.HasIndex(e => e.IsActive);
            
            // Relationship with Bank
            entity.HasOne(e => e.Bank)
                  .WithMany(b => b.Products)
                  .HasForeignKey(e => e.BankId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // Configure Bank entity
        modelBuilder.Entity<Bank>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Code).IsRequired().HasMaxLength(20);
            entity.HasIndex(e => e.Code).IsUnique();
            entity.HasIndex(e => e.Name);
        });

        // Configure DepositProduct entity
        modelBuilder.Entity<DepositProduct>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.InterestRate).HasPrecision(18, 4);
            entity.Property(e => e.MinimumAmount).HasPrecision(18, 2);
            entity.Property(e => e.MaximumAmount).HasPrecision(18, 2);
            
            entity.HasOne(e => e.Bank)
                  .WithMany(b => b.DepositProducts)
                  .HasForeignKey(e => e.BankId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasIndex(e => new { e.BankId, e.Type });
            entity.HasIndex(e => e.InterestRate);
        });

        // Configure CreditCard entity
        modelBuilder.Entity<CreditCard>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.AnnualFee).HasPrecision(18, 2);
            entity.Property(e => e.CashAdvanceRate).HasPrecision(18, 4);
            entity.Property(e => e.PurchaseRate).HasPrecision(18, 4);
            entity.Property(e => e.MinimumIncome).HasPrecision(18, 2);
            entity.Property(e => e.Benefits).HasColumnType("TEXT");
            entity.Property(e => e.Features).HasColumnType("TEXT");
            
            entity.HasOne(e => e.Bank)
                  .WithMany(b => b.CreditCards)
                  .HasForeignKey(e => e.BankId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasIndex(e => new { e.BankId, e.Type });
            entity.HasIndex(e => e.AnnualFee);
        });

        // Configure InvestmentProduct entity
        modelBuilder.Entity<InvestmentProduct>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.CurrentPrice).HasPrecision(18, 4);
            entity.Property(e => e.DailyChange).HasPrecision(18, 4);
            entity.Property(e => e.DailyChangePercent).HasPrecision(18, 2);
            entity.Property(e => e.Volume).HasPrecision(18, 2);
            entity.Property(e => e.HighPrice).HasPrecision(18, 4);
            entity.Property(e => e.LowPrice).HasPrecision(18, 4);
            entity.Property(e => e.OpenPrice).HasPrecision(18, 4);
            
            entity.HasIndex(e => e.Symbol).IsUnique();
            entity.HasIndex(e => e.Type);
            entity.HasIndex(e => e.CurrentPrice);
        });

        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
            entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(500);
            entity.Property(e => e.MonthlyIncome).HasPrecision(18, 2);
            
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.Role);
        });

        // Configure UserFavorite entity
        modelBuilder.Entity<UserFavorite>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Favorites)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasIndex(e => new { e.UserId, e.EntityType, e.EntityId }).IsUnique();
        });

        // Configure UserComparison entity
        modelBuilder.Entity<UserComparison>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ComparisonName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.EntityType).IsRequired().HasMaxLength(50);
            entity.Property(e => e.EntityIds).IsRequired().HasColumnType("TEXT");
            entity.Property(e => e.Notes).HasColumnType("TEXT");
            
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Comparisons)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Article entity
        modelBuilder.Entity<Article>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(300);
            entity.Property(e => e.Slug).IsRequired().HasMaxLength(400);
            entity.Property(e => e.Summary).HasMaxLength(1000);
            entity.Property(e => e.Content).HasColumnType("TEXT");
            entity.Property(e => e.Category).HasMaxLength(100);
            entity.Property(e => e.Tags).HasMaxLength(500);
            entity.Property(e => e.FeaturedImage).HasMaxLength(500);
            entity.Property(e => e.Author).HasMaxLength(200);
            
            entity.HasIndex(e => e.Slug).IsUnique();
            entity.HasIndex(e => e.Category);
            entity.HasIndex(e => e.IsPublished);
            entity.HasIndex(e => e.PublishedAt);
        });

        // Configure NewsItem entity
        modelBuilder.Entity<NewsItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Summary).HasMaxLength(1000);
            entity.Property(e => e.SourceUrl).IsRequired().HasMaxLength(1000);
            entity.Property(e => e.Source).IsRequired().HasMaxLength(100);
            entity.Property(e => e.ImageUrl).HasMaxLength(500);
            entity.Property(e => e.Category).HasMaxLength(100);
            entity.Property(e => e.Tags).HasMaxLength(500);
            
            entity.HasIndex(e => e.PublishedAt);
            entity.HasIndex(e => e.IsActive);
        });

        // Configure FAQ entity
        modelBuilder.Entity<FAQ>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Question).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Answer).IsRequired().HasColumnType("TEXT");
            entity.Property(e => e.Category).HasMaxLength(100);
            
            entity.HasIndex(e => e.Category);
            entity.HasIndex(e => e.SortOrder);
        });

        // Configure ScrapingJob entity
        modelBuilder.Entity<ScrapingJob>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.JobName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Configuration).HasColumnType("TEXT");
            entity.Property(e => e.Selectors).HasColumnType("TEXT");
            entity.Property(e => e.Headers).HasColumnType("TEXT");
            entity.Property(e => e.ErrorMessage).HasColumnType("TEXT");
            entity.Property(e => e.UserAgent).HasMaxLength(500);
            
            entity.HasIndex(e => e.DataType);
            entity.HasIndex(e => e.IsActive);
            entity.HasIndex(e => e.NextRunAt);
        });

        // Configure ScrapingJobLog entity
        modelBuilder.Entity<ScrapingJobLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Message).HasColumnType("TEXT");
            entity.Property(e => e.Details).HasColumnType("TEXT");
            
            entity.HasOne(e => e.ScrapingJob)
                  .WithMany(j => j.Logs)
                  .HasForeignKey(e => e.ScrapingJobId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasIndex(e => e.LoggedAt);
            entity.HasIndex(e => e.Status);
        });

        // Configure SystemSetting entity
        modelBuilder.Entity<SystemSetting>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Key).IsRequired().HasMaxLength(100);
            
            entity.HasIndex(e => e.Key).IsUnique();
        });

        // Seed data
        // modelBuilder.SeedInitialData(); // Temporarily disabled for migration
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        var now = DateTime.UtcNow;

        modelBuilder.Entity<Product>().HasData(
            new Product
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Type = ProductType.PersonalLoan,
                LenderName = "Türkiye İş Bankası",
                ProductName = "İhtiyaç Kredisi",
                InterestRate = 1.89m,
                InterestType = InterestType.Fixed,
                MinAmount = 5000,
                MaxAmount = 200000,
                MinTerm = 12,
                MaxTerm = 60,
                Description = "Uygun faizli ihtiyaç kredisi",
                Features = "[\"Masrafsız\",\"Hızlı onay\",\"Esnek ödeme\"]",
                Eligibility = "[\"18 yaş üstü\",\"Düzenli gelir\"]",
                CreatedAt = now,
                UpdatedAt = now,
                IsActive = true
            },
            new Product
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Type = ProductType.PersonalLoan,
                LenderName = "Garanti BBVA",
                ProductName = "Garantili İhtiyaç Kredisi",
                InterestRate = 1.95m,
                InterestType = InterestType.Fixed,
                MinAmount = 10000,
                MaxAmount = 150000,
                MinTerm = 12,
                MaxTerm = 48,
                Description = "Avantajlı ihtiyaç kredisi",
                Features = "[\"Düşük faiz\",\"Online başvuru\"]",
                Eligibility = "[\"18-65 yaş arası\"]",
                CreatedAt = now,
                UpdatedAt = now,
                IsActive = true
            },
            new Product
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Type = ProductType.CreditCard,
                LenderName = "Akbank",
                ProductName = "Akbank Axess Kredi Kartı",
                InterestRate = 2.50m,
                InterestType = InterestType.Variable,
                MinAmount = 1000,
                MaxAmount = 50000,
                MinTerm = 1,
                MaxTerm = 12,
                Description = "Avantajlı kredi kartı",
                Features = "[\"Worldpoints kazanın\",\"Yıllık kart ücreti yok\"]",
                Eligibility = "[\"18 yaş üstü\"]",
                CreatedAt = now,
                UpdatedAt = now,
                IsActive = true
            },
            new Product
            {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                Type = ProductType.Mortgage,
                LenderName = "Yapı Kredi",
                ProductName = "Konut Kredisi",
                InterestRate = 1.25m,
                InterestType = InterestType.Fixed,
                MinAmount = 100000,
                MaxAmount = 2000000,
                MinTerm = 60,
                MaxTerm = 240,
                Description = "Ev sahibi olmanın en kolay yolu",
                Features = "[\"Uzun vade\",\"Düşük faiz\"]",
                Eligibility = "[\"Gelir belgesi\",\"Peşinat gerekli\"]",
                CreatedAt = now,
                UpdatedAt = now,
                IsActive = true
            },
            new Product
            {
                Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                Type = ProductType.AutoLoan,
                LenderName = "QNB Finansbank",
                ProductName = "Taşıt Kredisi",
                InterestRate = 1.69m,
                InterestType = InterestType.Fixed,
                MinAmount = 50000,
                MaxAmount = 1000000,
                MinTerm = 12,
                MaxTerm = 60,
                Description = "Hayalinizdeki araca kavuşun",
                Features = "[\"Sıfır ve ikinci el\",\"Hızlı onay\"]",
                Eligibility = "[\"18 yaş üstü\",\"Sürücü belgesi\"]",
                CreatedAt = now,
                UpdatedAt = now,
                IsActive = true
            }
        );
        
        // Configure scraping entities
        ConfigureScrapingEntities(modelBuilder);
    }
    
    private void ConfigureScrapingEntities(ModelBuilder modelBuilder)
    {
        // Configure ScrapingResult entity
        modelBuilder.Entity<ScrapingResult>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Status).IsRequired();
            entity.Property(e => e.StartTime).IsRequired();
            entity.Property(e => e.Duration).HasPrecision(10, 2);
            entity.Property(e => e.ResponseTime).HasPrecision(10, 2);
            entity.Property(e => e.RawData).HasColumnType("TEXT");
            entity.Property(e => e.ProcessedData).HasColumnType("TEXT");
            entity.Property(e => e.ErrorMessage).HasColumnType("TEXT");
            entity.Property(e => e.StackTrace).HasColumnType("TEXT");
            entity.Property(e => e.UserAgent).HasMaxLength(500);
            entity.Property(e => e.IpAddress).HasMaxLength(100);
            entity.Property(e => e.Metadata).HasColumnType("TEXT");
            
            entity.HasOne(e => e.ScrapingJob)
                  .WithMany(j => j.Results)
                  .HasForeignKey(e => e.ScrapingJobId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasIndex(e => e.ScrapingJobId);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.StartTime);
        });

        // Configure CurrencyRate entity
        modelBuilder.Entity<CurrencyRate>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CurrencyCode).IsRequired().HasMaxLength(10);
            entity.Property(e => e.CurrencyName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.BuyingRate).HasPrecision(18, 6);
            entity.Property(e => e.SellingRate).HasPrecision(18, 6);
            entity.Property(e => e.CentralRate).HasPrecision(18, 6);
            entity.Property(e => e.PreviousRate).HasPrecision(18, 6);
            entity.Property(e => e.ChangePercent).HasPrecision(8, 4);
            entity.Property(e => e.ChangeAmount).HasPrecision(18, 6);
            entity.Property(e => e.Source).IsRequired().HasMaxLength(50);
            
            entity.HasIndex(e => new { e.CurrencyCode, e.RateDate, e.Source }).IsUnique();
            entity.HasIndex(e => e.RateDate);
        });

        // Configure GoldPrice entity
        modelBuilder.Entity<GoldPrice>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.GoldType).IsRequired().HasMaxLength(50);
            entity.Property(e => e.BuyingPrice).HasPrecision(18, 2);
            entity.Property(e => e.SellingPrice).HasPrecision(18, 2);
            entity.Property(e => e.PreviousPrice).HasPrecision(18, 2);
            entity.Property(e => e.ChangePercent).HasPrecision(8, 4);
            entity.Property(e => e.ChangeAmount).HasPrecision(18, 2);
            entity.Property(e => e.Source).IsRequired().HasMaxLength(50);
            
            entity.HasIndex(e => new { e.GoldType, e.PriceDate, e.Source }).IsUnique();
            entity.HasIndex(e => e.PriceDate);
        });

        // Configure StockData entity
        modelBuilder.Entity<StockData>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Symbol).IsRequired().HasMaxLength(10);
            entity.Property(e => e.CompanyName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.CurrentPrice).HasPrecision(18, 4);
            entity.Property(e => e.OpenPrice).HasPrecision(18, 4);
            entity.Property(e => e.HighPrice).HasPrecision(18, 4);
            entity.Property(e => e.LowPrice).HasPrecision(18, 4);
            entity.Property(e => e.PreviousClose).HasPrecision(18, 4);
            entity.Property(e => e.ChangePercent).HasPrecision(8, 4);
            entity.Property(e => e.ChangeAmount).HasPrecision(18, 4);
            entity.Property(e => e.MarketCap).HasPrecision(20, 2);
            entity.Property(e => e.Source).IsRequired().HasMaxLength(50);
            
            entity.HasIndex(e => new { e.Symbol, e.DataDate, e.Source }).IsUnique();
            entity.HasIndex(e => e.Symbol);
            entity.HasIndex(e => e.DataDate);
        });

        // Configure NewsArticle entity
        modelBuilder.Entity<NewsArticle>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Summary).HasMaxLength(1000);
            entity.Property(e => e.Content).HasColumnType("TEXT");
            entity.Property(e => e.SourceUrl).IsRequired().HasMaxLength(1000);
            entity.Property(e => e.Source).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Author).HasMaxLength(200);
            entity.Property(e => e.ImageUrl).HasMaxLength(500);
            entity.Property(e => e.Tags).HasMaxLength(500);
            entity.Property(e => e.Category).HasMaxLength(100);
            
            entity.HasIndex(e => e.Source);
            entity.HasIndex(e => e.PublishedAt);
            entity.HasIndex(e => e.Category);
            entity.HasIndex(e => e.IsActive);
        });

        // Configure EconomicIndicator entity
        modelBuilder.Entity<EconomicIndicator>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.IndicatorCode).IsRequired().HasMaxLength(100);
            entity.Property(e => e.IndicatorName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Value).HasPrecision(18, 6);
            entity.Property(e => e.Unit).HasMaxLength(20);
            entity.Property(e => e.Period).HasMaxLength(20);
            entity.Property(e => e.PreviousValue).HasPrecision(18, 6);
            entity.Property(e => e.ChangePercent).HasPrecision(8, 4);
            entity.Property(e => e.Source).IsRequired().HasMaxLength(50);
            
            entity.HasIndex(e => new { e.IndicatorCode, e.DataDate, e.Source }).IsUnique();
            entity.HasIndex(e => e.IndicatorCode);
            entity.HasIndex(e => e.DataDate);
        });

        // Configure LoanProduct entity
        modelBuilder.Entity<LoanProduct>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ProductName).IsRequired().HasMaxLength(300);
            entity.Property(e => e.LoanType).IsRequired().HasMaxLength(50);
            entity.Property(e => e.MinAmount).HasPrecision(18, 2);
            entity.Property(e => e.MaxAmount).HasPrecision(18, 2);
            entity.Property(e => e.MinInterestRate).HasPrecision(8, 4);
            entity.Property(e => e.MaxInterestRate).HasPrecision(8, 4);
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.Features).HasColumnType("TEXT"); // JSON
            
            entity.HasOne(e => e.Bank)
                  .WithMany()
                  .HasForeignKey(e => e.BankId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasIndex(e => e.BankId);
            entity.HasIndex(e => e.LoanType);
            entity.HasIndex(e => e.IsActive);
            entity.HasIndex(e => e.IsPromoted);
            entity.HasIndex(e => new { e.LoanType, e.IsActive });
        });

        // Configure CreditCardProduct entity
        modelBuilder.Entity<CreditCardProduct>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CardName).IsRequired().HasMaxLength(300);
            entity.Property(e => e.CardImageUrl).HasMaxLength(500);
            entity.Property(e => e.Category).IsRequired().HasMaxLength(50);
            entity.Property(e => e.AnnualFee).HasPrecision(18, 2);
            entity.Property(e => e.WelcomeBonusAmount).HasPrecision(18, 2);
            entity.Property(e => e.MilesProgram).HasMaxLength(100);
            entity.Property(e => e.PointsPerTL).HasPrecision(8, 4);
            entity.Property(e => e.MilesPerTL).HasPrecision(8, 4);
            entity.Property(e => e.CashbackRate).HasPrecision(8, 4);
            entity.Property(e => e.Features).HasColumnType("TEXT"); // JSON
            entity.Property(e => e.Advantages).HasColumnType("TEXT"); // JSON
            
            entity.HasOne(e => e.Bank)
                  .WithMany()
                  .HasForeignKey(e => e.BankId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasIndex(e => e.BankId);
            entity.HasIndex(e => e.Category);
            entity.HasIndex(e => e.IsActive);
            entity.HasIndex(e => e.IsPromoted);
            entity.HasIndex(e => new { e.Category, e.IsActive });
            entity.HasIndex(e => new { e.BankId, e.CardName }).IsUnique();
        });

        // Configure DepositRate entity
        modelBuilder.Entity<DepositRate>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Currency).IsRequired().HasMaxLength(10);
            entity.Property(e => e.InterestRate).HasPrecision(8, 4);
            entity.Property(e => e.MinAmount).HasPrecision(18, 2);
            entity.Property(e => e.MaxAmount).HasPrecision(18, 2);
            entity.Property(e => e.CampaignDetails).HasMaxLength(500);
            
            entity.HasOne(e => e.Bank)
                  .WithMany()
                  .HasForeignKey(e => e.BankId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasIndex(e => e.BankId);
            entity.HasIndex(e => e.Currency);
            entity.HasIndex(e => e.TermMonths);
            entity.HasIndex(e => new { e.BankId, e.Currency, e.TermMonths });
            entity.HasIndex(e => e.EffectiveDate);
            entity.HasIndex(e => e.IsActive);
        });

        // Configure Campaign entity
        modelBuilder.Entity<Campaign>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(300);
            entity.Property(e => e.CampaignType).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.BonusAmount).HasPrecision(18, 2);
            entity.Property(e => e.DiscountRate).HasPrecision(8, 4);
            entity.Property(e => e.Conditions).HasMaxLength(1000);
            entity.Property(e => e.ImageUrl).HasMaxLength(500);
            
            entity.HasOne(e => e.Bank)
                  .WithMany()
                  .HasForeignKey(e => e.BankId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasIndex(e => e.BankId);
            entity.HasIndex(e => e.CampaignType);
            entity.HasIndex(e => e.IsActive);
            entity.HasIndex(e => e.IsFeatured);
            entity.HasIndex(e => e.StartDate);
            entity.HasIndex(e => e.EndDate);
            entity.HasIndex(e => new { e.IsActive, e.IsFeatured });
        });

        // Configure ContentArticle entity
        modelBuilder.Entity<ContentArticle>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Slug).IsRequired().HasMaxLength(600);
            entity.Property(e => e.MetaDescription).HasMaxLength(300);
            entity.Property(e => e.MetaKeywords).HasMaxLength(500);
            entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
            entity.Property(e => e.FeaturedImageUrl).HasMaxLength(500);
            entity.Property(e => e.Content).HasColumnType("TEXT");
            entity.Property(e => e.Author).HasMaxLength(200);
            entity.Property(e => e.TableOfContents).HasColumnType("TEXT"); // JSON
            entity.Property(e => e.RelatedArticleIds).HasColumnType("TEXT"); // JSON
            
            entity.HasIndex(e => e.Slug).IsUnique();
            entity.HasIndex(e => e.Category);
            entity.HasIndex(e => e.IsPublished);
            entity.HasIndex(e => e.IsFeatured);
            entity.HasIndex(e => e.PublishedAt);
            entity.HasIndex(e => new { e.Category, e.IsPublished });
        });

        // Configure FrequentlyAskedQuestion entity
        modelBuilder.Entity<FrequentlyAskedQuestion>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Question).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Answer).HasColumnType("TEXT");
            
            entity.HasIndex(e => e.Category);
            entity.HasIndex(e => new { e.Category, e.DisplayOrder });
            entity.HasIndex(e => e.IsActive);
        });
    }
}
