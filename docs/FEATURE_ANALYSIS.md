# KredyIo - Rakip Analizi ve Özellik Belirleme

## 📊 Rakip Analiz Özeti

### Ana Rakipler:
1. **hesap.com** - Kredi ve banka karşılaştırma
2. **enuygunfinans.com** - Kapsamlı finans ürünleri
3. **hesapkurdu.com** - Tüm finansal ürünler

## 🚀 Eksik Olan Ana Özellikler

### 1. Finans Ürün Kategorileri
- ✅ **Krediler** (Mevcut)
  - İhtiyaç Kredisi
  - Konut Kredisi  
  - Taşıt Kredisi
  - Ticari Kredi
- ❌ **Mevduat Ürünleri** (EKSİK)
  - Vadeli Mevduat
  - Vadesiz Mevduat
  - Döviz Mevduatı
  - Altın Hesabı
- ❌ **Kredi Kartları** (EKSİK)
  - Bireysel Kredi Kartları
  - Ticari Kredi Kartları
  - Ödeme Kartları
- ❌ **Yatırım Ürünleri** (EKSİK)
  - Hisse Senedi
  - Altın
  - Döviz
  - Fon Ürünleri
- ❌ **Sigorta Ürünleri** (EKSİK)
  - Kasko
  - Trafik Sigortası
  - Hayat Sigortası
  - Sağlık Sigortası

### 2. Ana Sayfalar ve Navigasyon
- ❌ **Ana Sayfa Yeniden Tasarım**
  - Hero Section
  - Ürün Kategorileri
  - Popüler Ürünler
  - Güncel Kampanyalar
- ❌ **Banka Listesi Sayfası**
  - Tüm bankalar
  - Banka detay sayfaları
  - Banka ürünleri
- ❌ **Kategori Sayfaları**
  - Krediler ana sayfası
  - Mevduat ana sayfası
  - Kredi kartları ana sayfası
  - Yatırım ana sayfası
- ❌ **Hesaplama Araçları**
  - Kredi hesaplayıcı (Mevcut ama geliştirilmeli)
  - Mevduat hesaplayıcı
  - Emeklilik hesaplayıcı
  - Döviz çevirici

### 3. İçerik ve Bilgi Sayfaları
- ❌ **Bilgi Merkezi**
  - Finans rehberleri
  - SSS
  - Kredi notu rehberi
  - Faiz oranları tarihi
- ❌ **Haberler ve Güncel İçerik**
  - Finans haberleri
  - Ekonomik gelişmeler
  - Faiz oranı değişiklikleri
- ❌ **Blog/Makale Sistemi**
  - Finans ipuçları
  - Yatırım tavsiyeleri
  - Kredi kullanım rehberi

### 4. Kullanıcı Özellikleri
- ❌ **Kullanıcı Hesabı**
  - Kayıt olma
  - Giriş yapma
  - Profil yönetimi
- ❌ **Favori Sistem**
  - Ürünleri favorilere ekleme
  - Karşılaştırma listesi
  - Takip edilen ürünler
- ❌ **Kişiselleştirme**
  - Öneri sistemi
  - Kişiye özel ürünler
  - İlgi alanlarına göre içerik

### 5. Mobil ve UX Özellikleri
- ❌ **Gelişmiş Filtreleme**
  - Çoklu filtre sistemi
  - Fiyat aralığı
  - Banka seçimi
  - Ürün özellikleri
- ❌ **Arama Sistemi**
  - Akıllı arama
  - Öneri sistemi
  - Popüler aramalar
- ❌ **Mobil Optimizasyon**
  - PWA özellikler
  - Offline çalışma
  - Push notification

## 🏗️ Yeni Entity Tasarımı

### 1. Banka Entity'si
```csharp
public class Bank
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Code { get; set; }
    public string LogoUrl { get; set; }
    public string WebsiteUrl { get; set; }
    public string Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
    
    // Navigation Properties
    public ICollection<Product> Products { get; set; }
    public ICollection<DepositProduct> DepositProducts { get; set; }
    public ICollection<CreditCard> CreditCards { get; set; }
}
```

### 2. Mevduat Ürünleri Entity'si
```csharp
public class DepositProduct
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int BankId { get; set; }
    public DepositType Type { get; set; } // Vadeli, Vadesiz, Döviz, Altın
    public decimal InterestRate { get; set; }
    public int MinimumAmount { get; set; }
    public int MaximumAmount { get; set; }
    public int MinimumTerm { get; set; } // Gün
    public int MaximumTerm { get; set; } // Gün
    public string Currency { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
    
    // Navigation Properties
    public Bank Bank { get; set; }
}
```

### 3. Kredi Kartı Entity'si
```csharp
public class CreditCard
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int BankId { get; set; }
    public CreditCardType Type { get; set; } // Bireysel, Ticari, Premium
    public decimal AnnualFee { get; set; }
    public decimal CashAdvanceRate { get; set; }
    public decimal PurchaseRate { get; set; }
    public int RewardPoints { get; set; }
    public string Benefits { get; set; } // JSON format
    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
    
    // Navigation Properties
    public Bank Bank { get; set; }
}
```

### 4. Yatırım Ürünleri Entity'si
```csharp
public class InvestmentProduct
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Symbol { get; set; }
    public InvestmentType Type { get; set; } // Hisse, Altın, Döviz, Fon
    public decimal CurrentPrice { get; set; }
    public decimal DailyChange { get; set; }
    public decimal DailyChangePercent { get; set; }
    public decimal Volume { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
}
```

### 5. Kullanıcı Entity'si
```csharp
public class User
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string PhoneNumber { get; set; }
    public DateTime BirthDate { get; set; }
    public decimal MonthlyIncome { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime LastLoginDate { get; set; }
    
    // Navigation Properties
    public ICollection<UserFavorite> Favorites { get; set; }
    public ICollection<UserComparison> Comparisons { get; set; }
}
```

### 6. Favori ve Karşılaştırma Entity'leri
```csharp
public class UserFavorite
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string ProductType { get; set; } // Product, DepositProduct, CreditCard
    public int ProductId { get; set; }
    public DateTime CreatedDate { get; set; }
    
    // Navigation Properties
    public User User { get; set; }
}

public class UserComparison
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; }
    public string ProductIds { get; set; } // JSON format
    public string ProductTypes { get; set; } // JSON format
    public DateTime CreatedDate { get; set; }
    
    // Navigation Properties
    public User User { get; set; }
}
```

### 7. İçerik Entity'leri
```csharp
public class Article
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Slug { get; set; }
    public string Content { get; set; }
    public string Summary { get; set; }
    public string ImageUrl { get; set; }
    public ArticleCategory Category { get; set; }
    public string Tags { get; set; }
    public int ViewCount { get; set; }
    public bool IsPublished { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
    public DateTime? PublishedDate { get; set; }
}

public class NewsItem
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public string Source { get; set; }
    public string SourceUrl { get; set; }
    public DateTime CreatedDate { get; set; }
    public bool IsActive { get; set; }
}
```

## 🕷️ Web Scraping Hedef Siteleri

### 1. Kredi Faiz Oranları
- **TCMB** - Merkez Bankası verileri
- **TBB** - Türkiye Bankalar Birliği
- **Bankalar** - Direkt banka siteleri

### 2. Mevduat Faiz Oranları
- **Banka siteleri** - Güncel mevduat faizleri
- **Finans portalları** - Karşılaştırma siteleri

### 3. Altın ve Döviz Fiyatları
- **TCMB** - Resmi kurlar
- **Borsa İstanbul** - Altın fiyatları
- **Finans API'leri** - Gerçek zamanlı veriler

### 4. Hisse Senedi Verileri
- **Borsa İstanbul** - BIST verileri
- **Finans API'leri** - Hisse verileri

## 📱 Yeni Sayfa Yapısı

### Ana Navigasyon
1. **Ana Sayfa**
2. **Krediler**
   - İhtiyaç Kredisi
   - Konut Kredisi
   - Taşıt Kredisi
   - Ticari Kredi
3. **Mevduat**
   - Vadeli Mevduat
   - Vadesiz Mevduat
   - Döviz Mevduatı
   - Altın Hesabı
4. **Kredi Kartları**
   - Bireysel Kartlar
   - Ticari Kartlar
   - Premium Kartlar
5. **Yatırım**
   - Hisse Senedi
   - Altın
   - Döviz
   - Yatırım Fonları
6. **Bankalar**
   - Banka Listesi
   - Banka Detayları
7. **Hesaplama Araçları**
   - Kredi Hesaplayıcı
   - Mevduat Hesaplayıcı
   - Emeklilik Hesaplayıcı
8. **Bilgi Merkezi**
   - Rehberler
   - SSS
   - Haberler
   - Blog

## 🎯 Öncelikli Geliştirme Sırası

### Faz 1: Temel Altyapı (1-2 hafta)
1. ✅ Mevcut sistem (Tamamlandı)
2. Yeni entity'ler ve veritabanı
3. Admin panel altyapısı
4. Kullanıcı sistemi

### Faz 2: Ana Özellikler (2-3 hafta)
1. Mevduat ürünleri sistemi
2. Kredi kartları sistemi
3. Banka yönetimi
4. Gelişmiş arama ve filtreleme

### Faz 3: İçerik ve Scraping (2-3 hafta)
1. İçerik yönetim sistemi
2. Web scraping altyapısı
3. Veri toplama job'ları
4. Monitoring sistemi

### Faz 4: Gelişmiş Özellikler (2-3 hafta)
1. Yatırım ürünleri
2. Kişiselleştirme
3. Mobil optimizasyon
4. Performance iyileştirmeleri

## 📊 Beklenen İş Yükü
- **Backend Development**: ~40-50 saat
- **Frontend Development**: ~60-70 saat
- **Scraping System**: ~20-30 saat
- **Admin Panel**: ~30-40 saat
- **Testing & QA**: ~20-30 saat
- **Documentation**: ~10-15 saat

**Toplam**: ~180-235 saat (6-8 hafta full-time)