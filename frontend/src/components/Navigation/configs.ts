/**
 * Navigation Configuration
 * Predefined navigation structures for KredyIo
 * 
 * Based on Turkish banking website patterns:
 * - Krediler (Loans)
 * - Kredi Kartları (Credit Cards)
 * - Mevduat (Deposits)
 * - Ticari (Business)
 * - Hesaplama Araçları (Calculators)
 */

import { NavDropdown, FooterSection } from './types';

// ============================================
// Main Navigation Items
// ============================================

export const mainNavItems: NavDropdown[] = [
  {
    id: 'krediler',
    label: 'Krediler',
    columns: 3,
    items: [
      {
        id: 'ihtiyac-kredisi',
        label: 'İhtiyaç Kredisi',
        href: '/krediler/ihtiyac-kredisi',
        description: 'Anında başvuru, hızlı onay',
        isPopular: true,
      },
      {
        id: 'konut-kredisi',
        label: 'Konut Kredisi',
        href: '/krediler/konut-kredisi',
        description: 'Ev sahibi olmanın en kolay yolu',
      },
      {
        id: 'tasit-kredisi',
        label: 'Taşıt Kredisi',
        href: '/krediler/tasit-kredisi',
        description: 'Hayalinizdeki araç için uygun faiz',
      },
      {
        id: 'emekli-kredisi',
        label: 'Emekli Kredisi',
        href: '/krediler/emekli-kredisi',
        description: 'Emekliler için özel fırsatlar',
      },
      {
        id: 'tuketici-kredisi',
        label: 'Tüketici Kredisi',
        href: '/krediler/tuketici-kredisi',
        description: 'İhtiyaçlarınıza özel kredi çözümleri',
      },
      {
        id: 'kredi-karsilastir',
        label: 'Kredi Karşılaştır',
        href: '/krediler/karsilastir',
        description: 'En uygun krediyi bulun',
        featured: true,
      },
    ],
    ctaButton: {
      label: 'Tüm Kredileri Gör',
      href: '/krediler',
      variant: 'primary',
    },
  },
  {
    id: 'kredi-kartlari',
    label: 'Kredi Kartları',
    columns: 3,
    items: [
      {
        id: 'avantajli-kart',
        label: 'Avantajlı Kartlar',
        href: '/kredi-kartlari/avantajli',
        description: 'Her alışverişte kazanç',
        isPopular: true,
      },
      {
        id: 'mil-puan-kart',
        label: 'Mil & Puan Kartları',
        href: '/kredi-kartlari/mil-puan',
        description: 'Seyahat edin, puan kazanın',
      },
      {
        id: 'alisveris-kart',
        label: 'Alışveriş Kartları',
        href: '/kredi-kartlari/alisveris',
        description: 'Kampanyalı alışveriş fırsatları',
      },
      {
        id: 'taksit-kart',
        label: 'Taksit Kartları',
        href: '/kredi-kartlari/taksit',
        description: 'Esnek ödeme seçenekleri',
      },
      {
        id: 'platinum-kart',
        label: 'Platinum Kartlar',
        href: '/kredi-kartlari/platinum',
        description: 'Ayrıcalıklı bankacılık deneyimi',
        isNew: true,
      },
      {
        id: 'kart-karsilastir',
        label: 'Kart Karşılaştır',
        href: '/kredi-kartlari/karsilastir',
        description: 'Size en uygun kartı bulun',
        featured: true,
      },
    ],
    ctaButton: {
      label: 'Tüm Kartları Gör',
      href: '/kredi-kartlari',
      variant: 'primary',
    },
  },
  {
    id: 'mevduat',
    label: 'Mevduat',
    columns: 2,
    items: [
      {
        id: 'vadeli-mevduat',
        label: 'Vadeli Mevduat',
        href: '/mevduat/vadeli',
        description: 'Yüksek faiz oranları',
        isPopular: true,
      },
      {
        id: 'vadesiz-mevduat',
        label: 'Vadesiz Mevduat',
        href: '/mevduat/vadesiz',
        description: 'Günlük bankacılık işlemleri',
      },
      {
        id: 'doviz-mevduat',
        label: 'Döviz Mevduat',
        href: '/mevduat/doviz',
        description: 'Döviz cinsinden tasarruf',
      },
      {
        id: 'altin-mevduat',
        label: 'Altın Mevduat',
        href: '/mevduat/altin',
        description: 'Altın ile değer kazanın',
      },
    ],
    ctaButton: {
      label: 'Mevduat Hesapla',
      href: '/hesaplama/mevduat',
      variant: 'primary',
    },
  },
  {
    id: 'ticari',
    label: 'Ticari Bankacılık',
    columns: 2,
    items: [
      {
        id: 'ticari-kredi',
        label: 'Ticari Krediler',
        href: '/ticari/krediler',
        description: 'İşletmeniz için kredi çözümleri',
      },
      {
        id: 'isletme-kredisi',
        label: 'İşletme Kredisi',
        href: '/ticari/isletme-kredisi',
        description: 'İşletme sermayesi finansmanı',
      },
      {
        id: 'pos-hizmetleri',
        label: 'POS Hizmetleri',
        href: '/ticari/pos',
        description: 'Ödeme kabul çözümleri',
        isNew: true,
      },
      {
        id: 'esnaf-kredisi',
        label: 'Esnaf Kredisi',
        href: '/ticari/esnaf-kredisi',
        description: 'Esnaflar için özel krediler',
      },
    ],
  },
  {
    id: 'hesaplama',
    label: 'Hesaplama Araçları',
    columns: 2,
    items: [
      {
        id: 'kredi-hesaplama',
        label: 'Kredi Hesaplama',
        href: '/hesaplama/kredi',
        description: 'Taksit ve faiz hesaplama',
        isPopular: true,
      },
      {
        id: 'mevduat-hesaplama',
        label: 'Mevduat Hesaplama',
        href: '/hesaplama/mevduat',
        description: 'Getiri hesaplama',
      },
      {
        id: 'kart-limit',
        label: 'Kart Limit Hesaplama',
        href: '/hesaplama/kart-limit',
        description: 'Kredi kartı limit belirleme',
      },
      {
        id: 'erken-odeme',
        label: 'Erken Ödeme Hesaplama',
        href: '/hesaplama/erken-odeme',
        description: 'Kapanış tutarı hesaplama',
      },
    ],
    ctaButton: {
      label: 'Tüm Hesaplama Araçları',
      href: '/hesaplama',
      variant: 'secondary',
    },
  },
];

// ============================================
// Footer Sections
// ============================================

export const footerSections: FooterSection[] = [
  {
    id: 'products',
    title: 'Ürünler',
    items: [
      { id: 'ihtiyac-kredisi', label: 'İhtiyaç Kredisi', href: '/krediler/ihtiyac-kredisi' },
      { id: 'konut-kredisi', label: 'Konut Kredisi', href: '/krediler/konut-kredisi' },
      { id: 'tasit-kredisi', label: 'Taşıt Kredisi', href: '/krediler/tasit-kredisi' },
      { id: 'kredi-kartlari', label: 'Kredi Kartları', href: '/kredi-kartlari' },
      { id: 'mevduat', label: 'Mevduat', href: '/mevduat' },
      { id: 'pos-hizmetleri', label: 'POS Hizmetleri', href: '/ticari/pos' },
    ],
  },
  {
    id: 'tools',
    title: 'Araçlar',
    items: [
      { id: 'kredi-hesaplama', label: 'Kredi Hesaplama', href: '/hesaplama/kredi' },
      { id: 'karsilastirma', label: 'Karşılaştırma', href: '/karsilastir' },
      { id: 'blog', label: 'Blog', href: '/blog' },
      { id: 'rehber', label: 'Kredi Rehberi', href: '/rehber' },
      { id: 'sss', label: 'Sıkça Sorulan Sorular', href: '/sss' },
    ],
  },
  {
    id: 'company',
    title: 'Kurumsal',
    items: [
      { id: 'hakkimizda', label: 'Hakkımızda', href: '/hakkimizda' },
      { id: 'iletisim', label: 'İletişim', href: '/iletisim' },
      { id: 'kariyer', label: 'Kariyer', href: '/kariyer' },
      { id: 'basin', label: 'Basın', href: '/basin' },
      { id: 'is-ortaklari', label: 'İş Ortakları', href: '/is-ortaklari' },
    ],
  },
  {
    id: 'legal',
    title: 'Yasal',
    items: [
      { id: 'gizlilik', label: 'Gizlilik Politikası', href: '/gizlilik' },
      { id: 'kullanim', label: 'Kullanım Koşulları', href: '/kullanim-kosullari' },
      { id: 'kvkk', label: 'KVKK Aydınlatma Metni', href: '/kvkk' },
      { id: 'cerez', label: 'Çerez Politikası', href: '/cerez-politikasi' },
      { id: 'bilgi-guvenligi', label: 'Bilgi Güvenliği', href: '/bilgi-guvenligi' },
    ],
  },
];

// ============================================
// Social Links
// ============================================

export const socialLinks = [
  { id: 'facebook', platform: 'facebook' as const, url: 'https://facebook.com/kredyio' },
  { id: 'twitter', platform: 'twitter' as const, url: 'https://twitter.com/kredyio' },
  { id: 'instagram', platform: 'instagram' as const, url: 'https://instagram.com/kredyio' },
  { id: 'linkedin', platform: 'linkedin' as const, url: 'https://linkedin.com/company/kredyio' },
  { id: 'youtube', platform: 'youtube' as const, url: 'https://youtube.com/@kredyio' },
];

// ============================================
// Trust Badges
// ============================================

export const trustBadges = [
  {
    id: 'etbis',
    name: 'ETBİS Üyesi',
    icon: '/images/badges/etbis.svg',
    tooltip: 'Elektronik Ticaret Bilgi Sistemi Üyesi',
  },
  {
    id: 'kvkk',
    name: 'KVKK Uyumlu',
    icon: '/images/badges/kvkk.svg',
    tooltip: 'Kişisel Verilerin Korunması Kanunu\'na Uygun',
  },
  {
    id: 'ssl',
    name: '256-bit SSL',
    icon: '/images/badges/ssl.svg',
    tooltip: 'Güvenli Bağlantı',
  },
  {
    id: 'iso',
    name: 'ISO 27001',
    icon: '/images/badges/iso.svg',
    tooltip: 'Bilgi Güvenliği Yönetim Sistemi Sertifikası',
  },
];

// ============================================
// Legal Links
// ============================================

export const legalLinks = [
  { id: 'gizlilik', label: 'Gizlilik', href: '/gizlilik' },
  { id: 'kullanim', label: 'Kullanım Koşulları', href: '/kullanim-kosullari' },
  { id: 'kvkk', label: 'KVKK', href: '/kvkk' },
  { id: 'cerez', label: 'Çerez Politikası', href: '/cerez-politikasi' },
];

// ============================================
// Contact Info
// ============================================

export const contactInfo = {
  phone: '0850 XXX XX XX',
  email: 'info@kredyio.com',
  address: 'Maslak Mahallesi, Büyükdere Caddesi No:123, Sarıyer, İstanbul',
};
