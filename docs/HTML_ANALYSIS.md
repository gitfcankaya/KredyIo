# HTML Örnek Dosyaları Analizi

## Genel Bakış
Bu dokümanda, `frontend/sample_shots` dizinindeki 136 HTML dosyasından çıkarılan UI pattern'leri, özellikler ve tasarım detayları listelenmiştir.

## 1. MEVDUAT FAİZ ORANLARI SAYFASI
**Kaynak:** `mevduat-faiz-oranlari.htm` (hangikredi.com)

### Sayfa Yapısı
- **Breadcrumb:** Anasayfa > Yatırım Araçları > Mevduat Hesaplama
- **Ana Başlık (H1):** "Mevduat Faizi Hesaplama"
- **Alt Başlık:** "Tüm bankaların güncel mevduat faiz oranlarını tek tıkla karşılaştır"

### Hesaplama Formu (Hero Section)
```html
<form> içinde 3 input, 1 select, 1 button
  - Ana Para (text input, maxlength=12, tel type)
  - Para Birimi (select: TL/USD/EURO)
  - Vade (readonly text input + dropdown)
  - "Faiz Hesapla" butonu (h-14, purple-700 bg)
```

**Form Özellikleri:**
- Beyaz arka planlı form kartı (bg-white, rounded-lg, p-8)
- Purple-200 arka planlı section içinde
- Label'lar: font-semibold, text-gray-700, text-base
- Input'lar: h-14, border-gray-300, rounded-lg

### Popüler Mevduatlar Bölümü
**Ana Kart Yapısı:**
```html
<div class="w-full md:w-[352px] rounded-lg border bg-white p-5">
  - Banka logosu (126x54 veya 136x56)
  - Ürün adı (max-w-[155px], text-xs, font-semibold)
  - 3 veri gösterimi (Faiz Oranı, Net Kazanç, Vade Sonu Tutar)
  - "Devam Et" butonu (h-10, text-xs, purple-700)
</div>
```

**Veri Gösterimi Pattern:**
- Değer: text-sm md:text-base, font-semibold, text-gray-800
- Etiket: text-xs, text-gray-700, font-normal
- Net Kazanç yanında animasyonlu pulse dot (bg-gray-300, animate-pulse, w-3 h-3)

### Faiz Oranları Tablosu
**Tablo Yapısı:**
- Sticky header: bg-purple-200, rounded-lg, font-bold
- Zebra striping: odd:bg-white, even:bg-purple-100
- 5 kolon: Bankalar, Faiz/Kar Payı, Ana Para, Vade, Ok icon
- Font: text-[0.813rem] md:text-sm
- Hücre padding: py-[17px]
- Son kolon: Arrow icon (after:h-[8px] w-[8px], rotate-45)

**Tablo Bilgileri:**
- Tarih damgası: "13 Ekim 2025 tarihinde yaptığımız son değerlendirme"
- En avantajlı banka vurgusu: %48 faiz ile Anadolubank
- "Daha fazla gör" butonu: text-purple-800, arrow icon ile

### "Haftalık Faiz Oranları" Chart Bölümü
- w-full md:max-w-[256px] sidebar
- Başlık: text-lg md:text-2xl, font-bold, line-clamp-2
- Açıklama: text-sm md:text-base, text-gray-700, line-clamp-5
- Chart container: w-full md:w-[calc(100%_-_288px)]

### Vadesine Göre Mevduat Tipleri
**Kart Grid:**
```html
<div class="grid md:grid-cols-2 gap-4 md:gap-x-8 md:gap-y-[30px]">
  <div class="h-[180px] md:h-[154px] rounded-md border bg-white p-5 md:p-6">
    - Başlık: text-base md:text-lg, text-purple-700, font-bold
    - Açıklama: line-clamp-5 md:line-clamp-3, text-sm md:text-base
  </div>
</div>
```

**Tipler:**
1. Vadesiz Mevduat
2. Vadeli Hesap
3. İhbarlı Mevduat

### "HangiKredi Nasıl Çalışır?" Bölümü
**Kart Yapısı (3 kart):**
```html
<div class="max-w-[304px] md:max-w-[352px] flex flex-col items-center">
  - Icon: h-[72px] w-[72px] md:h-[96px] md:w-[96px], rounded-lg
  - Başlık: text-base md:text-lg, font-bold, line-clamp-1
  - Açıklama: text-sm md:text-base, text-gray-700, line-clamp-3
</div>
```

**Adımlar:**
1. Listeler ve Bulur (list icon)
2. Karşılaştırır (comparison icon)
3. Güvenle Yönlendirir (bank icon)

### Çalıştığımız Bankalar Grid
**Banka Logoları:**
- Grid: grid-cols-3 md:grid-cols-6, gap-4 md:gap-8
- Logo container: h-[72px] md:h-[80px], border, rounded-md, grayscale
- Hover: grayscale-0, shadow-md
- Logo boyutu: relative h-8 w-[70px]

**Bankalar (18 adet):**
VakıfBank, Şekerbank, ICBC, Akbank, Alternatif, Anadolubank, CEPTETEB, DenizBank, Enpara, Fibabanka, Garanti BBVA, Garanti Portföy, getirfinans, Hayat Finans, HSBC, Halkbank, ING, İş Bankası

### Popüler Mevduat Kazanç Kutuları
**Grid Yapısı:**
```html
<div class="grid md:grid-cols-3 gap-0 md:gap-3">
  <div class="border-b md:border-b-0 md:border-r bg-white shadow-md">
    - Ana Para: 30.000/50.000/100.000/200.000/300.000/400.000 TL
    - 3 link: "32 Gün Vade" | "92 Gün Vade" | "181 Gün Vade"
    - Linkler: text-[13px] md:text-sm, font-bold, text-purple-700
    - Ayırıcı: after:border-r, after:h-[18px]
  </div>
</div>
```

### Güvenlik Sertifikaları
**Sertifika Kartları (5 adet):**
```html
<div class="flex md:flex-row items-center w-1/3 md:max-w-[352px]">
  - Icon: h-[44px] w-[44px] md:h-[72px] md:w-[72px], border, rounded-lg
  - İsim: text-base, font-bold
  - Açıklama: text-xs md:text-sm, line-clamp-2
</div>
```

**Sertifikalar:**
1. KVKK (Kişisel Verilerin Korunması Kanunu)
2. ETBİS (ETBİS'e Kayıtlı Doğrulanmış Site)
3. SSL (Katman Güvenliği Protokolü)
4. ISO 27001 (Bilgi Güvenliği Yönetim Sistemi)
5. ISAE 3402 (Uluslararası Bağımsız Denetim Güvence Standardı)

### Mevduat Uzman Yazıları
**Makale Kartları (3 kolon grid):**
```html
<article>
  - Görsel: relative h-[173px] md:h-[197px], rounded-lg
  - Başlık: h-12 md:h-14, text-base md:text-lg, font-bold, line-clamp-2
  - Özet: h-12, text-sm md:text-base, text-gray-700, line-clamp-2
</article>
```

**Yazılar:**
1. "Mevduat Getirisinden Gelir Vergisi Kesilir mi?"
2. "Mevduat Faizi mi, Ev Almak mı Daha Kârlı?"
3. "Mevduat Faizi Nasıl Hesaplanır?"

### SSS (Sık Sorulan Sorular)
**Accordion Yapısı:**
```html
<li class="rounded-md border border-gray-200">
  <div class="p-5 pr-14 cursor-pointer relative">
    - Soru: text-sm md:text-base, md:font-semibold, text-gray-800
    - Arrow icon: absolute right-[27px], rotate-[-135deg]
    - Hover: text-purple-700
  </div>
  <div class="accordion_content hidden">
    - Cevap içeriği (HTML destekli)
  </div>
</li>
```

**Soru Sayısı:** 11 adet (Mevduat Hesabı Nedir?, Faiz Oranları Nasıl Belirlenir?, vb.)

### Structured Data (JSON-LD)
```json
{
  "@type": "InvestmentOrDeposit" (3 örnek ürün),
  "@type": "BreadcrumbList",
  "@type": "FAQPage" (11 soru-cevap),
  "@type": "WebPage"
}
```

---

## 2. KREDİ HESAPLAMA ARAÇLARI SAYFASI
**Kaynak:** `hesaplama-araclari.htm` (hangikredi.com)

### Sayfa Meta Bilgileri
- **Başlık:** "Kredi Hesaplama - Kredi Faiz Oranları 2025"
- **Açıklama:** "İhtiyaç, konut, taşıt, esnaf kredisi faiz oranlarını karşılaştır"
- **Kategori Hiyerarşisi:** Kredi > Hesaplama Araçları

### Analytics Tracking
```javascript
hkPageCategory = 'Kredi'
hkPageMidCategory = ''
hkPageSubCategory = 'Hesaplama Araçları'
hkPageType = 'Category Page'
hkPageName = "Kredi Hesaplama - Kredi Faiz Oranları 2025"
```

### Google Tag Manager Entegrasyonu
- GTM ID: GTM-K3KM5Z
- DataLayer push: hkUserTrackingId, hkExternalUserId, hkSha256Email
- Cookie okuma: userTrackingId, _hkeui, _hke

### Performance Monitoring
**Metrikler:**
- Response time (resTime)
- Response byte size (resByte)
- Navigation timing API kullanımı
- Googlebot için özel tracking
- POST endpoint: `/api/customer-services/store/bot`

**Ölçülen Değerler:**
- navigationStart, domContentLoadedEventEnd
- transferSize (toplam resource boyutu)
- İstek detayları: method, uriStem, uriQuery, userAgent, status, host

### SHA256 Cookie Validation
- Citrix NetScaler seed cookie kullanımı
- HMAC-SHA256 hash hesaplama
- MC (Machine Cookie) oluşturma
- 100ms interval ile cookie değişiklik kontrolü

### Öne Çıkan Özellikler
1. **Favicon:** Multiple size support (16x16, 32x32, 48x48, 96x96, 180x180)
2. **Mobile App Integration:** Google Play ve Apple App Store linkleri
3. **DNS Prefetch:** dist-klasor.hangikredi.com, Google Fonts
4. **Security:** HTTPS, SSL sertifikası

---

## 3. PUAN KAZANDIRAN KARTLAR SAYFASI
**Kaynak:** `puan-kazandiran-kartlar.htm` (hesapkurdu.com)

### Sayfa Yapısı
- **Domain:** hesapkurdu.com (farklı platform)
- **Başlık:** "En Çok Puan Kazandıran Kredi Kartları"
- **Meta Robots:** index,nofollow

### Structured Data (FAQPage)
**SSS Konuları (7 soru):**
1. Kredi Kartı Puanı Nedir?
2. Kredi Kartı Para Puan Nedir?
3. Para Puanın TL Karşılıkları
4. Kredi Kartı Mil Puan Nedir?
5. Alışveriş ile Puan Nasıl Kazanılır?
6. Kredi Kartı Puanı ile Alışveriş
7. Para Puan İnternet Alışverişlerinde Kullanılabilir mi?

**Puan Örnekleri:**
- Garanti Bonus: 1 TL = 100 Bonus puan
- Yapı Kredi WorldCard: 25 TL = 1 Worldpuan (1 TL = 200 Worldpuan)

### Breadcrumb
Ana Sayfa > Kredi Kartı > Puan Kazandıran Kartlar

### Font Sistemi
- **Primary Font:** Inter (variable font)
- **CSS Variable:** --font-inter: '__Inter_2c65a9', '__Inter_Fallback_2c65a9'
- **Preload:** WOFF2 format, size-adjust crossorigin

### Social Media Integration
- Facebook App ID: 1661288800813836
- Facebook Admins: ibrhim.colak
- Google Site Verification: relqFc60Usxclu82Eb9YAyi2sWqGJZnuWB7FTbaH3_U
- Open Graph: og:title, og:description, og:site_name, og:type=website

### Mobile App Smart Banners
- Google Play: app-id=com.hesapkurdu
- Apple Store: app-id=1293671036

### CDN Yapısı
- **Design CDN:** design-prod.sm.mncdn.com
- **Image CDN:** cdn.hesapkurdu.com
- **Optimize CDN:** next-optimize-prod.mncdn.com
- **Preconnect:** fonts.gstatic.com
- **DNS Prefetch:** Multiple CDN endpoints

### CSS Architecture
**Modüler CSS Files (11 adet):**
```
f07a776ecea70d3d.css (global)
8da6fd2b553fd74f.css (page-specific)
3cd2548b61617d13.css
6ca93f4765d44a55.css
f0f06cd45f53ed82.css
75783f883544b0a6.css
10d81226ec98f658.css
a7a4b0add9a35ce9.css
f3723ecca73807d6.css
795fa6b9764fd4b9.css
506194c933ce8d24.css
```

### JavaScript Chunks
**Webpack Splitting:**
- polyfills-42372ed130431b0a.js (noModule)
- Framework: framework-06db24698b240fad.js
- Main: main-53aa6988673cee19.js
- App: pages/_app-be0bf466ccc5c2e0.js
- Page-specific: pages/kredi-karti/puan-kazandiran-kartlar-660d4cd9a4f9ff89.js

**Lazy Loaded Chunks (13 adet):**
3319, 614, 9195, 9212, 3560, 8055, 434, 5234, 5669, 2185, 7970, 371, 8171, 9023, 3478, 8088

### Advanced Security Features
**Citrix NetScaler Integration:**
- Dynamic cookie validation (citrix_ns_seed)
- SHA-256 HMAC token generation
- Real-time cookie monitoring (100ms interval)
- Domain-wide MC (Machine Cookie) setting
- Token: "16433200967043860061"

**Cookie Functions:**
```javascript
getCookie(name) - Parse cookies
checkCookie() - Validate & regenerate hash
HMAC_SHA256_MAC(key, msg) - Generate secure hash
```

### Performance Tracking
**Custom Timing API:**
```javascript
NS_CSM_td = 276844316 (timing data)
NS_CSM_pd = 275116664 (page data)
NS_CSM_u = "/clm10" (endpoint)
NS_CSM_col = "AAA..." (collection ID)
```

**Tracked Metrics:**
- Navigation start, unload events, redirect timing
- DNS lookup, connection establishment, secure connection
- Request/response timing, DOM events
- Load events, full page lifecycle

---

## 4. ORTAK UI PATTERN'LERİ

### Renk Paleti
**Primary Colors:**
- Purple-700: #6B21A8 (Primary buttons, links)
- Purple-800: #581C87 (Hover states)
- Purple-200: #E9D5FF (Backgrounds)
- Purple-100: #F3E8FF (Alternate rows)

**Grayscale:**
- Gray-900: #111827 (Headings)
- Gray-800: #1F2937 (Body text)
- Gray-700: #374151 (Secondary text)
- Gray-600: #4B5563 (Tertiary text)
- Gray-300: #D1D5DB (Borders)
- Gray-200: #E5E7EB (Dividers)
- Gray-100: #F3F4F6 (Backgrounds)

**Semantic Colors:**
- Green-100, Green-800: Success, best rates
- Red-500: New badges, warnings
- Blue (Cyan): Online special badges

### Typography Sistemi
**Font Families:**
- Primary: Inter (Variable font)
- Fallback: System fonts, Open Sans

**Font Sizes:**
- text-xs: 0.75rem (12px)
- text-sm: 0.875rem (14px)
- text-base: 1rem (16px)
- text-lg: 1.125rem (18px)
- text-xl: 1.25rem (20px)
- text-2xl: 1.5rem (24px)
- text-3xl: 1.875rem (30px)

**Font Weights:**
- font-normal: 400
- font-semibold: 600
- font-bold: 700

**Line Heights:**
- leading-extra-tight: 1.1
- leading-tight: 1.25
- leading-5: 1.25rem
- leading-6: 1.5rem
- leading-7: 1.75rem

### Spacing Sistemi
**Padding:**
- p-5: 1.25rem (20px)
- p-6: 1.5rem (24px)
- p-8: 2rem (32px)
- px-4: 1rem horizontal
- py-4: 1rem vertical

**Gap (Grid/Flex):**
- gap-3: 0.75rem
- gap-4: 1rem
- gap-8: 2rem
- gap-x-10: 2.5rem horizontal
- gap-y-8: 2rem vertical

**Margin:**
- mb-4: 1rem bottom
- mb-6: 1.5rem bottom
- mt-7: 1.75rem top
- mt-[50px]: 50px top (custom)

### Border & Shadows
**Borders:**
- border: 1px solid
- border-2: 2px solid
- border-gray-200, border-gray-300
- rounded-lg: 0.5rem (8px)
- rounded-md: 0.375rem (6px)

**Shadows:**
- shadow-xs: Subtle shadow
- shadow-md: Medium shadow
- shadow-2xl: Deep shadow
- shadow-lg: Large shadow

### Button Patterns
**Primary Button:**
```css
bg-purple-700 hover:bg-purple-800
text-white font-bold
h-12 md:h-14 rounded-lg
focus:ring-2 focus:ring-purple-500
disabled:bg-purple-200 disabled:text-purple-400
```

**Secondary/Text Button:**
```css
text-purple-700 hover:text-purple-800
font-bold h-auto
focus:ring-0
```

**Button Sizes:**
- h-10: Small (40px)
- h-12: Medium (48px)
- h-14: Large (56px)

### Card Components
**Standard Card:**
```html
<div class="rounded-lg border border-gray-200 bg-white p-5 md:p-6">
  <!-- Content -->
</div>
```

**Hover Card:**
```css
transition-all duration-300
hover:shadow-md
group-hover:text-purple-700
```

**Card Widths:**
- w-full md:w-[352px]: Product cards
- max-w-[304px] md:max-w-[352px]: Feature cards
- w-[330px]: Menu dropdown items

### Grid Layouts
**Common Grid Patterns:**
```css
/* 3-column responsive */
grid-cols-1 md:grid-cols-3
gap-4 md:gap-8

/* 2-column responsive */
grid-cols-1 md:grid-cols-2
gap-4 md:gap-x-8 md:gap-y-[30px]

/* 6-column bank logos */
grid-cols-3 md:grid-cols-6
gap-[15px] md:gap-8
```

### Icon & Arrow Patterns
**Chevron Down (Dropdown):**
```css
after:absolute after:border-l-2 after:border-t-2
after:h-[7px] after:w-[7px]
after:border-gray-500 after:rotate-[-135deg]
```

**Arrow Right (Links):**
```css
after:absolute after:right-[-16px]
after:h-[7px] after:w-[7px]
after:rotate-45
after:border-r-2 after:border-b-2
after:border-purple-800
```

**Expand/Collapse Icon:**
```css
after:top-[-4px] after:h-[7px] after:w-[7px]
after:border-l-2 after:border-t-2
after:rotate-[-135deg] /* Down */
after:rotate-[45deg] /* Up - on hover */
```

### Badge Components
**Badge Styles:**
```css
/* New Badge */
bg-red-500 text-white
text-xs font-bold
px-2 py-1 rounded

/* Active Badge */
bg-green-500 text-white

/* Online Special */
bg-blue-100 text-blue-700

/* Category Badge */
bg-purple-100 text-purple-700
```

### Line Clamp Patterns
```css
line-clamp-1 /* Single line */
line-clamp-2 /* Two lines */
line-clamp-3 /* Three lines (mobile) md:line-clamp-3 (desktop) */
line-clamp-4 /* Four lines (mobile) */
line-clamp-5 /* Five lines (mobile) md:line-clamp-3 (desktop) */
```

### Responsive Breakpoints
**Tailwind Default:**
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

**Common Patterns:**
```css
text-sm md:text-base /* Font size */
p-5 md:p-6 /* Padding */
h-[173px] md:h-[197px] /* Height */
w-full md:w-[352px] /* Width */
grid-cols-1 md:grid-cols-3 /* Grid columns */
```

### Animation & Transitions
**Common Transitions:**
```css
transition-all duration-300
transition-colors duration-200
group-hover:grayscale-0 /* Remove grayscale on hover */
animate-pulse /* Loading indicator */
```

**Hover Effects:**
```css
hover:bg-gray-100
hover:text-purple-700
hover:shadow-md
group-hover:text-purple-700
```

### Container & Layout
**Container:**
```css
.container {
  max-width: 1280px (xl breakpoint)
  mx-auto (center)
  px-4 (mobile padding)
}
```

**Section Spacing:**
```css
py-6 md:py-10 /* Section padding */
mt-7 mb-8 md:mt-[50px] md:mb-16 /* Section margins */
```

---

## 5. FORM & INPUT PATTERN'LERİ

### Text Input
```html
<input 
  class="w-full rounded-lg py-3 px-3 h-14 text-base
         border border-gray-300 bg-white
         font-semibold text-gray-800 outline-none"
  type="tel"
  maxLength="12"
  placeholder="Ana para girin"
/>
```

### Select Dropdown
```html
<select 
  class="w-full appearance-none rounded-lg bg-white
         py-3 pr-2 pl-4 h-14 text-base
         font-semibold text-gray-800 outline-none"
>
  <option value="1">TL</option>
  <option value="2">USD</option>
  <option value="3">EURO</option>
</select>
<!-- Arrow icon with after pseudo-element -->
```

### Form Label
```css
font-semibold text-gray-700 text-base leading-6
```

### Form Field Wrapper
```html
<div class="w-full grow basis-0">
  <label>Label Text</label>
  <div class="form-field relative flex flex-col border rounded-lg bg-white mt-1">
    <!-- Input -->
  </div>
</div>
```

### Readonly Input (Date Picker Style)
```html
<input 
  type="text" 
  readonly
  class="w-full rounded-lg cursor-default
         py-2 px-3 h-14 text-base
         text-left font-semibold text-gray-800"
  placeholder="Gün seçin"
/>
```

---

## 6. TABLE PATTERN'LERİ

### Comparison Table
```html
<table class="w-full border-separate border-spacing-0 whitespace-nowrap">
  <thead class="text-xs md:text-sm font-bold">
    <tr class="rounded-lg bg-purple-200">
      <th class="py-4 text-start first-of-type:rounded-tl-lg 
                 first-of-type:rounded-bl-lg 
                 last-of-type:rounded-tr-lg 
                 last-of-type:rounded-br-lg
                 first-of-type:pl-4 md:first-of-type:pl-6
                 last-of-type:pr-6">
        Header Text
      </th>
    </tr>
  </thead>
  <tbody>
    <tr class="odd:bg-white even:bg-purple-100">
      <td class="text-[0.813rem] md:text-sm 
                 py-[17px] font-semibold
                 first-of-type:pl-4 md:first-of-type:pl-6
                 first-of-type:rounded-tl-lg 
                 first-of-type:rounded-bl-lg 
                 last-of-type:rounded-tr-lg 
                 last-of-type:rounded-br-lg">
        Cell Content
      </td>
    </tr>
  </tbody>
</table>
```

**Table Özellikleri:**
- Zebra striping (alternating row colors)
- Rounded corners on first/last cells
- Responsive font sizes
- Sticky positioning için data attributes

---

## 7. NAVIGATION & MENU PATTERN'LERİ

### Breadcrumb
```html
<nav class="mt-5 md:mt-7 text-xs md:text-sm font-semibold text-gray-800">
  <ul class="container flex whitespace-nowrap">
    <li class="pr-9">
      <a href="/">Anasayfa</a>
      <span class="arrow-right"></span>
    </li>
    <li class="pr-9 font-normal text-gray-700">Current Page</li>
  </ul>
</nav>
```

### Mega Menu (Dropdown)
```html
<div class="navbar-item group hover:bg-gray-100">
  <a href="/kredi" class="text-base leading-6">Kredi</a>
  <span class="arrow-down group-hover:after:rotate-[45deg]"></span>
  
  <div class="absolute left-0 z-10 hidden group-hover:block
              w-full bg-gray-100 py-8 shadow-lg top-[78px]">
    <ul class="container flex flex-wrap gap-x-10 gap-y-8">
      <li class="w-[330px]">
        <div class="h-[130px] rounded-lg bg-white px-5 py-6 
                    hover:text-purple-700">
          <img src="icon.svg" width="20" height="20" />
          <span class="text-sm font-semibold">İhtiyaç Kredisi</span>
          <p class="text-xs text-gray-600 line-clamp-3">Description</p>
        </div>
      </li>
    </ul>
  </div>
</div>
```

---

## 8. STRUCTURED DATA & SEO

### InvestmentOrDeposit (Mevduat Ürünü)
```json
{
  "@context": "https://schema.org",
  "@type": "InvestmentOrDeposit",
  "name": "Serbest Plus Hesap",
  "amount": "50000 TRY",
  "interestRate": "44%",
  "brand": {
    "@type": "Brand",
    "name": "Akbank"
  }
}
```

### FAQPage (Sık Sorulan Sorular)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Mevduat Hesabı Nedir?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "HTML formatted answer..."
    }
  }]
}
```

### BreadcrumbList
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "item": {
      "@id": "https://www.hangikredi.com",
      "name": "Anasayfa"
    }
  }]
}
```

---

## 9. PERFORMANCE & OPTIMIZATION

### Resource Loading Strategy
1. **Preconnect:** CDN'ler, font servisleri
2. **DNS Prefetch:** Üçüncü parti servisler
3. **Preload:** Critical CSS, fonts
4. **Lazy Load:** Images, non-critical scripts
5. **Code Splitting:** Webpack chunks
6. **Tree Shaking:** Unused code elimination

### Image Optimization
- Next.js Image component kullanımı
- Multiple sizes (srcset)
- Lazy loading (loading="lazy")
- WebP format desteği
- CDN üzerinden servis

### JavaScript Optimizations
- Defer attribute
- NoModule fallback
- Dynamic imports
- Chunk splitting
- Polyfills ayrı bundle

### CSS Optimizations
- Modular architecture
- Critical CSS inline
- Non-critical CSS lazy load
- Unused CSS purging
- PostCSS optimization

---

## 10. TRACKING & ANALYTICS

### Google Tag Manager
```javascript
dataLayer.push({
  hkUserTrackingId: 'user-tracking-id',
  hkExternalUserId: 'external-user-id',
  hkSha256Email: 'hashed-email',
  hkPageCategory: 'Kredi',
  hkPageSubCategory: 'Hesaplama Araçları',
  hkPageType: 'Category Page',
  hkPageName: 'Kredi Hesaplama'
});
```

### Custom Events
- Form submissions
- Button clicks
- Page interactions
- Scroll depth
- Time on page
- Exit intent

### Cookie Tracking
- userTrackingId: User session
- _hkeui: External user ID
- _hke: Hashed email (SHA-256)
- citrix_ns_seed: Security validation

---

## 11. ACCESSIBILITY FEATURES

### ARIA Attributes
```html
<button aria-label="Akbank">
<nav data-testid="breadcrumb-container">
<img alt="Akbank Mevduat Hesaplama">
```

### Keyboard Navigation
- Focus states: focus:ring-2 focus:ring-purple-500
- Tab index management
- Skip links
- Focus indicators

### Screen Reader Support
- Semantic HTML (header, nav, main, section, article)
- Alt text for images
- Label associations
- ARIA labels where needed

### Color Contrast
- WCAG AA compliance
- Text contrast ratios > 4.5:1
- Focus indicators clearly visible

---

## 12. RESPONSIVE DESIGN PATTERNS

### Mobile-First Approach
```css
/* Mobile default */
text-sm p-5 grid-cols-1

/* Tablet and up */
md:text-base md:p-6 md:grid-cols-2

/* Desktop */
lg:grid-cols-3 xl:max-w-[1280px]
```

### Touch-Friendly Targets
- Minimum 44x44px tap targets
- Adequate spacing between clickable elements
- Larger padding on mobile

### Responsive Images
```html
<img 
  loading="lazy" 
  width="75" 
  height="20"
  decoding="async"
  srcset="image.svg 1x, image@2x.svg 2x"
  alt="Bank Logo"
/>
```

### Mobile Navigation
- Hamburger menu
- Bottom navigation bar
- Collapsible sections
- Swipe gestures

---

## 13. CONVERSION OPTIMIZATION

### CTA (Call-to-Action) Hierarchy
1. **Primary:** "Devam Et", "Faiz Hesapla" (Purple-700)
2. **Secondary:** "Daha fazla gör" (Text-purple-700)
3. **Tertiary:** Bank logo links

### Trust Indicators
- Security certificates (5 badges)
- Bank logos (18 banks)
- Customer reviews
- Guarantees (TMSF 400.000 TL)

### Social Proof
- "20'den fazla banka"
- "En avantajlı teklif"
- "%48 faiz ile Anadolubank"
- "En yüksek mevduat faiz oranı"

### Urgency & Scarcity
- "Güncel faiz oranları"
- "Son değerlendirme tarihi"
- "Kampanyalar süreli"
- Countdown timers (where applicable)

---

## SONUÇ VE ÖNERİLER

### Güçlü Yönler
✅ Comprehensive filtering system
✅ Detailed comparison tables
✅ Clear visual hierarchy
✅ Mobile-responsive design
✅ Strong security indicators
✅ Structured data for SEO
✅ Performance optimization
✅ Accessibility features

### Geliştirme Alanları
🔸 **Skeleton Loading:** Yüklenme sırasında placeholder göster
🔸 **Progressive Enhancement:** JavaScript olmadan da çalışan base functionality
🔸 **Dark Mode:** Kullanıcı tercihine göre tema değiştirme
🔸 **Infinite Scroll:** Pagination yerine dinamik yükleme
🔸 **Real-time Updates:** WebSocket ile canlı faiz oranları
🔸 **Personalization:** Kullanıcı davranışına göre öneriler
🔸 **A/B Testing:** Button colors, text, layout variations
🔸 **Micro-interactions:** Hover effects, loading animations

### KredyIo Projesi İçin Öncelikler

#### Fase 1: Temel UI Componentleri (✅ TAMAMLANDI)
- [x] LoanList
- [x] CreditCardList  
- [x] DepositRateList
- [x] CampaignList

#### Fase 2: Ortak Componentler (Sonraki Adım)
1. **ProductCard** (2 variant: Primary, Compact)
2. **FilterPanel** (Sidebar desktop, Modal mobile)
3. **ComparisonTable** (Sortable, filterable)
4. **CalculatorForm** (Loan, deposit, early payment)
5. **BadgeComponent** (New, Active, Online, Category)
6. **FAQAccordion** (JSON-LD structured data)
7. **BankLogoGrid** (Grayscale hover effect)
8. **SecurityBadges** (5 certificate display)

#### Fase 3: Sayfalar
1. Ana Sayfa (Hero + Featured products)
2. Kredi Hesaplama Araçları
3. Kampanyalar Listesi
4. Ürün Detay Sayfası
5. Karşılaştırma Sayfası
6. SSS Sayfası

#### Fase 4: İleri Özellikler
1. Kullanıcı hesabı ve favoriler
2. Kredi başvuru formu
3. Karşılaştırma tool (side-by-side)
4. Hesaplama geçmişi
5. E-posta bildirimleri
6. PDF export

### Teknik Borç Yönetimi
- [ ] Unit test coverage > 80%
- [ ] E2E test coverage > 60%
- [ ] Lighthouse score > 90
- [ ] Accessibility audit
- [ ] Performance monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics implementation (GA4)

---

**Son Güncelleme:** 2025-01-13
**Analiz Eden:** GitHub Copilot
**Dosya Sayısı:** 3/136 (2% tamamlandı)
**Sonraki Adım:** Kalan 133 HTML dosyasının analizi
