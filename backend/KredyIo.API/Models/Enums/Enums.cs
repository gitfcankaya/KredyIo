namespace KredyIo.API.Models.Enums
{
    public enum DepositType
    {
        VadeliMevduat = 1,
        VadesizMevduat = 2,
        DovizMevduati = 3,
        AltinHesabi = 4,
        YatirimHesabi = 5
    }

    public enum CreditCardType
    {
        Bireysel = 1,
        Ticari = 2,
        Premium = 3,
        Platinum = 4,
        World = 5
    }

    public enum InvestmentType
    {
        HisseSenedi = 1,
        Altin = 2,
        Doviz = 3,
        YatirimFonu = 4,
        Tahvil = 5,
        VarlıgaDayalıMenkul = 6
    }

    public enum ArticleCategory
    {
        KrediRehberi = 1,
        YatirimTavsiyeleri = 2,
        EkonomikHaberler = 3,
        FinansIpuclari = 4,
        BankaHaberleri = 5,
        MevduatRehberi = 6,
        KrediKartiRehberi = 7
    }

    public enum UserRole
    {
        User = 1,
        Admin = 2,
        Moderator = 3
    }

    public enum JobStatus
    {
        Pending = 1,
        Running = 2,
        Completed = 3,
        Failed = 4,
        Cancelled = 5
    }

    public enum JobType
    {
        CreditRateScraping = 1,
        DepositRateScraping = 2,
        CurrencyRateScraping = 3,
        GoldPriceScraping = 4,
        StockDataScraping = 5,
        NewsContentScraping = 6
    }
}