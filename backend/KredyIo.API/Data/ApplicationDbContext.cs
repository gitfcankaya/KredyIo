using Microsoft.EntityFrameworkCore;
using KredyIo.API.Models.Entities;

namespace KredyIo.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.LenderName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.ProductName).IsRequired().HasMaxLength(300);
            entity.Property(e => e.InterestRate).HasPrecision(5, 2);
            entity.Property(e => e.MinAmount).HasPrecision(18, 2);
            entity.Property(e => e.MaxAmount).HasPrecision(18, 2);
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.UpdatedAt).IsRequired();
            entity.Property(e => e.IsActive).IsRequired().HasDefaultValue(true);

            entity.HasIndex(e => e.Type);
            entity.HasIndex(e => e.LenderName);
            entity.HasIndex(e => e.InterestRate);
            entity.HasIndex(e => e.IsActive);
        });

        // Seed data
        SeedData(modelBuilder);
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
    }
}
