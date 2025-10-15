# KredyIo - Web Scraping ve Crawler Sistemi Tasarımı

## 🕷️ Crawler Sistemi Mimarisi

### 1. Hedef Veriler ve Kaynaklar

#### A. Kredi Faiz Oranları
- **TCMB (Türkiye Cumhuriyet Merkez Bankası)**
  - URL: `https://www.tcmb.gov.tr/wps/wcm/connect/TR/TCMB+TR/Main+Menu/Istatistikler/Faiz+Istatistikleri`
  - Veri: Politika faizi, bankalararası faiz oranları
  - Sıklık: Günlük

- **TBB (Türkiye Bankalar Birliği)**
  - URL: `https://www.tbb.org.tr/tr/bankacilik/banka-ve-sektor-bilgileri/istatistiki-raporlar/59`
  - Veri: Ortalama kredi faiz oranları
  - Sıklık: Haftalık

#### B. Mevduat Faiz Oranları
- **Banka Web Siteleri**
  - İş Bankası: `https://www.isbank.com.tr/faiz-oranlarimiz`
  - Garanti BBVA: `https://www.garantibbva.com.tr/tr/faiz-oranlarimiz`
  - Akbank: `https://www.akbank.com/tr-tr/faiz-oranlarimiz`
  - Sıklık: 4 saatte bir

#### C. Altın ve Döviz Fiyatları
- **TCMB Döviz Kurları**
  - URL: `https://www.tcmb.gov.tr/kurlar/today.xml`
  - Format: XML
  - Sıklık: 15 dakikada bir

- **Altın Fiyatları**
  - URL: `https://bigpara.hurriyet.com.tr/altin/`
  - Alternatif: `https://altin.in/`
  - Sıklık: 5 dakikada bir

#### D. Borsa Verileri
- **Borsa İstanbul**
  - URL: `https://www.borsaistanbul.com/tr/sayfa/334/endeks-degerleri`
  - Veri: BIST100, BIST30, sektör endeksleri
  - Sıklık: 1 dakikada bir (işlem saatleri)

- **Hisse Senedi Verileri**
  - API: `https://api.borsaistanbul.com/` (resmi API)
  - Yahoo Finance API (alternatif)
  - Sıklık: 1 dakikada bir

#### E. Finans Haberleri
- **Bloomberg Türkiye**
  - URL: `https://www.bloomberght.com/`
  - Kategoriler: Ekonomi, Borsa, Bankacılık
  - Sıklık: 30 dakikada bir

- **Ekonomist Dergisi**
  - URL: `https://www.ekonomist.com.tr/`
  - Sıklık: Saatlik

### 2. Scraping Teknolojileri

#### A. HtmlAgilityPack
- **Kullanım Alanı**: Statik HTML içerik
- **Avantajlar**: Hızlı, hafif, .NET native
- **Hedefler**: TCMB, TBB, banka siteleri

#### B. Selenium WebDriver
- **Kullanım Alanı**: JavaScript ile yüklenen dinamik içerik
- **Avantajlar**: Gerçek browser simülasyonu
- **Hedefler**: SPA uygulamaları, korumalı siteler

#### C. HTTP Client + API
- **Kullanım Alanı**: JSON/XML API'ler
- **Avantajlar**: En güvenilir ve hızlı
- **Hedefler**: TCMB XML, Borsa API'leri

### 3. Job Scheduler - Hangfire

#### A. Job Türleri
```csharp
public enum JobType
{
    CreditRateScraping = 1,      // Kredi faiz oranları
    DepositRateScraping = 2,     // Mevduat faiz oranları  
    CurrencyRateScraping = 3,    // Döviz kurları
    GoldPriceScraping = 4,       // Altın fiyatları
    StockDataScraping = 5,       // Hisse senedi verileri
    NewsContentScraping = 6      // Haber içeriği
}
```

#### B. Job Konfigürasyonu
```json
{
  "jobs": [
    {
      "name": "TCMB Döviz Kurları",
      "type": "CurrencyRateScraping",
      "url": "https://www.tcmb.gov.tr/kurlar/today.xml",
      "interval": "0 */15 * * * *",  // Her 15 dakikada
      "parser": "XmlParser",
      "selectors": {
        "currencies": "//Currency",
        "rates": "//ForexSelling"
      }
    },
    {
      "name": "Altın Fiyatları",
      "type": "GoldPriceScraping", 
      "url": "https://bigpara.hurriyet.com.tr/altin/",
      "interval": "0 */5 * * * *",   // Her 5 dakikada
      "parser": "HtmlParser",
      "selectors": {
        "gramGold": ".gold-item[data-code='gram-altin'] .value",
        "quarterGold": ".gold-item[data-code='ceyrek-altin'] .value"
      }
    }
  ]
}
```

### 4. Veri İşleme Pipeline

#### A. Extraction (Çıkarma)
1. **HTML Parsing**: HtmlAgilityPack ile DOM parsing
2. **Data Cleaning**: Gereksiz karakterleri temizleme
3. **Type Conversion**: String'den decimal/int'e dönüşüm
4. **Validation**: Veri doğrulama kuralları

#### B. Transformation (Dönüştürme)
1. **Normalization**: Farklı kaynaklardan gelen verileri standartlaştırma
2. **Currency Conversion**: Para birimi dönüşümleri
3. **Historical Comparison**: Önceki verilerle karşılaştırma
4. **Change Calculation**: Değişim oranı hesaplama

#### C. Loading (Yükleme)
1. **Database Update**: Mevcut kayıtları güncelleme
2. **New Record Creation**: Yeni kayıt oluşturma
3. **Archive Old Data**: Eski verileri arşivleme
4. **Cache Update**: Redis cache güncelleme

### 5. Monitoring ve Logging

#### A. Job Monitoring
- **Real-time Dashboard**: Hangfire Dashboard
- **Job Status Tracking**: Pending, Running, Completed, Failed
- **Performance Metrics**: Execution time, success rate
- **Alert System**: E-posta/SMS bildirimleri

#### B. Error Handling
- **Retry Logic**: Başarısız job'ları yeniden deneme
- **Circuit Breaker**: Sürekli başarısız olan job'ları durdurma
- **Fallback Mechanisms**: Alternatif veri kaynakları
- **Error Notifications**: Admin bilgilendirme

#### C. Logging
```csharp
public class ScrapingJobLogger
{
    public async Task LogJobStart(int jobId, string jobName)
    public async Task LogJobComplete(int jobId, ScrapingResult result)
    public async Task LogJobError(int jobId, Exception error)
    public async Task LogDataUpdate(string dataType, int recordsUpdated)
}
```

### 6. Güvenlik ve Rate Limiting

#### A. Anti-Bot Önlemleri
- **User-Agent Rotation**: Farklı browser UA'ları kullanma
- **Proxy Rotation**: IP değişimi
- **Request Delays**: İstekler arası bekleme
- **Session Management**: Çerez yönetimi

#### B. Rate Limiting
- **Per-Domain Limits**: Domain başına limit
- **Global Rate Limit**: Toplam istek limiti
- **Adaptive Throttling**: Başarı oranına göre hız ayarlama

#### C. Legal Compliance
- **robots.txt Respect**: Robots.txt kurallarına uyma
- **Terms of Service**: Site kullanım koşullarına uyum
- **Data Protection**: Kişisel veri koruma
- **Fair Use**: Makul kullanım ilkeleri

### 7. Performans Optimizasyonu

#### A. Caching
- **Redis Cache**: Sık kullanılan veriler
- **Memory Cache**: Session verileri
- **CDN**: Statik içerik
- **Database Indexes**: Hızlı sorgular

#### B. Parallel Processing
- **Concurrent Jobs**: Eş zamanlı job çalıştırma
- **Batch Processing**: Toplu veri işleme
- **Queue Management**: İş kuyruğu yönetimi
- **Resource Allocation**: Kaynak dağılımı

### 8. Failover ve Backup

#### A. Data Backup
- **Automated Backups**: Otomatik yedekleme
- **Point-in-Time Recovery**: Zaman noktası kurtarma
- **Cross-Region Replication**: Bölgeler arası replikasyon

#### B. Service Redundancy
- **Multiple Scrapers**: Aynı veri için farklı kaynaklar
- **Health Checks**: Servis sağlık kontrolü
- **Auto-Scaling**: Otomatik ölçeklendirme

### 9. API Endpoints

#### A. Admin Panel API'leri
```
GET /api/admin/jobs                     # Tüm job'ları listele
POST /api/admin/jobs                    # Yeni job oluştur
PUT /api/admin/jobs/{id}               # Job güncelle
DELETE /api/admin/jobs/{id}            # Job sil
POST /api/admin/jobs/{id}/run          # Job'ı manuel başlat
GET /api/admin/jobs/{id}/logs          # Job loglarını getir
GET /api/admin/dashboard/stats         # Dashboard istatistikleri
```

#### B. Data API'leri
```
GET /api/data/rates/current            # Güncel oranlar
GET /api/data/rates/history            # Geçmiş veriler
GET /api/data/gold/current             # Güncel altın fiyatları
GET /api/data/currency/current         # Güncel döviz kurları
GET /api/data/stocks/current           # Güncel hisse verileri
```

### 10. Implementation Plan

#### Phase 1: Core Infrastructure (1 hafta)
1. ✅ Entity'ler ve veritabanı yapısı
2. 🔄 Hangfire konfigürasyonu
3. ⏳ Base scraper sınıfları
4. ⏳ Logging sistemi

#### Phase 2: Basic Scrapers (1 hafta)
1. ⏳ TCMB döviz kurları scraper
2. ⏳ Altın fiyatları scraper
3. ⏳ BIST endeks scraper
4. ⏳ Temel haber scraper

#### Phase 3: Advanced Features (1 hafta)
1. ⏳ Admin panel backend
2. ⏳ Real-time monitoring
3. ⏳ Error handling & retry logic
4. ⏳ Performance optimization

#### Phase 4: Frontend Integration (1 hafta)
1. ⏳ Admin dashboard UI
2. ⏳ Real-time data display
3. ⏳ Job management interface
4. ⏳ Monitoring charts

### 11. Teknical Considerations

#### A. Scalability
- **Horizontal Scaling**: Çoklu instance desteği
- **Load Balancing**: Yük dağılımı
- **Database Sharding**: Veritabanı bölümleme
- **Microservices**: Servis ayrıştırması

#### B. Reliability
- **Circuit Breakers**: Hata izolasyonu
- **Bulkhead Pattern**: Kaynak izolasyonu
- **Timeout Handling**: Zaman aşımı yönetimi
- **Graceful Degradation**: Kademeli hizmet düşürme

#### C. Observability
- **Distributed Tracing**: Dağıtık izleme
- **Metrics Collection**: Metrik toplama
- **Health Endpoints**: Sağlık kontrol noktaları
- **Performance Monitoring**: Performans izleme