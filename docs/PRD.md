# Product Requirements Document (PRD)
## KredyIo - Kapsamlı Finansal Karşılaştırma Platformu

### 1. Executive Summary
KredyIo, Türkiye'nin en kapsamlı kredi, kredi kartı, mevduat ve yatırım karşılaştırma platformudur. Kullanıcılara bilinçli finansal kararlar almalarında yardımcı olmak üzere canlı faiz oranları, hesaplama araçları, piyasa verileri ve detaylı ürün karşılaştırmaları sunar.

### 2. Product Vision
Türkiye'de finansal ürünler için tek durak noktası olmak; şeffaf, güncel ve kapsamlı bilgi ile kullanıcıların en avantajlı seçenekleri bulmasını sağlamak.

### 3. Target Audience
- **Birincil:** Bireysel kredi, kredi kartı, konut/taşıt kredisi arayanlar
- **İkincil:** KOBİ sahipleri ve ticari kredi arayanlar
- **Üçüncül:** Yatırımcılar (mevduat, altın, döviz, hisse)
- **Destekleyici:** Mali müşavirler, bankacılık profesyonelleri

### 4. Detaylı Özellikler

#### 4.1 Ana Sayfa Features
**Hero Section:**
- Büyük başlık ve CTA butonları
- Arama çubuğu (ürün/banka arama)
- Gradient background

**Hızlı Hesaplama Widget'ları:**
- İhtiyaç Kredisi Hesaplama (tutar + vade)
- Konut Kredisi Hesaplama (tutar + vade 12-180 ay)
- Taşıt Kredisi Hesaplama (tutar + vade 3-48 ay)
- Kredi Kartı Limit Hesaplama (aylık gelir)

**Canlı Piyasa Verileri:**
- Döviz Kurları (Dolar, Euro, Sterlin - alış/satış)
- Altın Fiyatları (Gram, Çeyrek, Yarım, Cumhuriyet, Spot)
- BIST 100 Endeksi (güncel + değişim %)
- Tarih/saat damgası ve yükseliş/düşüş göstergeleri

**Öne Çıkan Bankalar:**
- 6-8 banka logosu grid
- Hover efektleri
- Banka detay sayfası linkleri

**Öne Çıkan Ürünler Carousel:**
- Sponsor badge'li ürünler
- Banka logosu, ürün adı
- Faiz oranı, aylık taksit, toplam ödeme
- "Detayları İncele" ve "Başvur" butonları

#### 4.2 Kredi Ürünleri Kataloğu

**İhtiyaç Kredisi:**
- Tutar: 500 TL - 1.000.000 TL
- Vade: 1-36 ay
- Karşılaştırma tablosu (banka, faiz, taksit, toplam)
- Filtreleme (banka, faiz aralığı, vade)
- FAQ (20+ soru)
- JSON-LD schema (SEO)

**Konut Kredisi:**
- Tutar: 5.000 TL - 100.000.000 TL
- Vade: 12-180 ay
- İlk evim/2. evim radio (BDDK kuralları)
- Faiz grafiği (1 ay, 3 ay, 6 ay, 1 yıl, tümü)
- En uygun kredi info box
- Detaylı SSS (25+ soru)

**Taşıt Kredisi:**
- Tutar: 500 TL - 20.000.000 TL
- Vade: 3-48 ay
- Araç tipi: Sıfır/2. El
- Peşinat hesaplama (BDDK oranları)
- Kasko değer listesi entegrasyonu
- SSS (15+ soru)

**Evlilik Kredisi:**
- Özel hesaplama
- Kampanyalar
- Banka karşılaştırması

**Faizsiz Krediler:**
- Katılım bankaları
- Kâr payı hesaplama
- İslami finans bilgilendirme

#### 4.3 Kredi Kartı Ürünleri

**Kategoriler:**
- Aidatsız Kredi Kartları
- Puan Kazandıran Kartlar
- Mil Kazandıran Kartlar
- Öğrenci Kredi Kartları
- Ticari Kredi Kartları

**Kart Detay Sayfası:**
- Kart görseli (yüksek çözünürlük)
- Banka logosu
- Özellikler (badge'ler)
- Avantajlar listesi (bullet points)
- Puan/Mil tablosu
- Harcama kategorilerine göre kazanç
- Başvuru formu
- SSS

#### 4.4 Mevduat ve Yatırım

**Mevduat Hesaplama:**
- Ana para (1.000 - 10.000.000 TL)
- Para birimi (TL, USD, EUR, GBP)
- Vade (1, 3, 6, 9, 12, 24 ay)
- Sonuç: Ana para, faiz, stopaj, net gelir, toplam

**Banka Mevduat Karşılaştırma:**
- Tablo: Banka, 1 ay, 3 ay, 6 ay, 12 ay, 24 ay
- Kampanya durumu
- Sıralama ve filtreleme

**Altın Yatırım:**
- Canlı altın fiyatları (10+ çeşit)
- Altın hesaplama (miktar, tip, para birimi)
- Alış/Satış seçimi
- Grafik ve trend analizi

**Döviz Çevirici:**
- 30+ para birimi
- Swap özelliği
- Güncel kurlar tablosu
- Grafik linki

#### 4.5 Ticari Ürünler

**KOBİ Kredisi:**
- Firma bilgileri formu
- Vergi no, şirket unvanı, sektör
- Yıllık ciro, çalışan sayısı
- Kredi amaçları (işletme sermayesi, makine, taşıt, vs.)

**Ticari Kredi Kartı:**
- Yüksek limitler (100.000 TL+)
- Muhasebe entegrasyonu
- Harcama raporları
- Çoklu kart seçeneği

**POS Sistemleri:**
- Sanal, fiziksel, mobil POS
- Komisyon karşılaştırma
- Taksit seçenekleri
- Kurulum ve aylık ücretler

#### 4.6 Yeni Müşteri Fırsatları

**Uzaktan Müşteri Edinimi:**
- Banka başvuru formları
- Hoşgeldin bonusu kampanyaları
- Şartlar ve geçerlilik

**Emekli Promosyonları:**
- Maaş aralığı filtresi
- İlk kez/nakil seçimi
- Promosyon tablosu

**Memur Promosyonları:**
- Kurum seçimi
- Taahhüt süreleri
- Ek avantajlar

#### 4.7 Bilgi Merkezi ve İçerik

**Rehber Makaleleri:**
- Kategoriler: Kredi, Kredi Kartı, Mevduat, Bankacılık
- Makale yapısı: Başlık, yazar, tarih, TOC, içerik
- İlgili makaleler
- Okuma süresi

**Sık Sorulan Sorular:**
- Accordion yapı
- JSON-LD schema
- Her ürün için ayrı SSS

**Hesaplama Araçları:**
- Kredi erken kapama
- KMH hesaplama
- Kredi kartı limit
- Taksitli nakit avans
- Dosya masrafı hesaplama

#### 4.8 Piyasa Verileri

**Hisse Senetleri:**
- BIST endeksleri
- Hisse listesi (sembol, fiyat, değişim, hacim)
- Grafik linkleri

**Yatırım Fonları:**
- Kategoriler (hisse, tahvil, karma, döviz, altın, para piyasası)
- Getiri tablosu (günlük, aylık, yıllık)
- Risk seviyesi

**Endeksler:**
- Yerli (BIST 100, 30, 50, sektör)
- Küresel (S&P 500, Nasdaq, DAX, FTSE, Nikkei)

**Halka Arz Takvimi:**
- Şirket adı, tarih, fiyat aralığı
- Başvuru tarihleri

#### 4.9 Banka Detay Sayfaları

**Banka Profili:**
- Logo, unvan, kuruluş, iletişim
- Ürün sekmesi (tüm ürünler)
- Kampanyalar sekmesi
- Şube/ATM bulucu (harita entegrasyonu)

### 5. User Stories

#### As a User:
- I want to compare credit products so that I can find the best deal
- I want to calculate monthly payments so that I can budget accordingly
- I want to filter products by my criteria so that I see relevant options
- I want to save products for later review
- I want to understand credit terms so that I can make informed decisions

#### As an Administrator:
- I want to manage product listings so that information is current
- I want to view analytics so that I can understand user behavior
- I want to manage content so that users have helpful resources

### 6. Success Metrics
- **User Engagement:** Daily active users, session duration, pages per session
- **Conversion:** Click-through rate to lender websites, application starts
- **Content:** Number of products compared, calculators used
- **Growth:** New user registrations, returning visitors

### 7. Technical Requirements
- Responsive web application (mobile, tablet, desktop)
- Fast page load times (< 3 seconds)
- High availability (99.9% uptime)
- Secure data handling (HTTPS, encryption)
- SEO optimized
- Accessibility compliant (WCAG 2.1)

### 8. Constraints
- Must comply with financial data regulations
- Must clearly disclose partnerships and affiliations
- Must update data regularly (at least daily)
- Must protect user privacy

### 9. Launch Strategy
- **Phase 1:** Core comparison features and calculators
- **Phase 2:** User accounts and personalization
- **Phase 3:** Educational content and guides
- **Phase 4:** Mobile app development

### 10. Dependencies
- Banking/lending institution partnerships or data sources
- Hosting infrastructure (Vercel)
- Database services
- Third-party APIs (if applicable)
