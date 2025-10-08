namespace KredyIo.API.Models.DTOs;

public class LoanPaymentRequest
{
    public decimal Amount { get; set; }
    public decimal InterestRate { get; set; }
    public int TermMonths { get; set; }
}

public class LoanPaymentResult
{
    public decimal MonthlyPayment { get; set; }
    public decimal TotalInterest { get; set; }
    public decimal TotalAmount { get; set; }
    public List<AmortizationEntry> AmortizationSchedule { get; set; } = new();
}

public class AmortizationEntry
{
    public int Month { get; set; }
    public decimal Payment { get; set; }
    public decimal Principal { get; set; }
    public decimal Interest { get; set; }
    public decimal Balance { get; set; }
}

public class InterestRequest
{
    public decimal Principal { get; set; }
    public decimal Rate { get; set; }
    public decimal Time { get; set; }
    public int CompoundFrequency { get; set; } = 12;
}

public class InterestResult
{
    public decimal SimpleInterest { get; set; }
    public decimal CompoundInterest { get; set; }
    public decimal TotalWithSimple { get; set; }
    public decimal TotalWithCompound { get; set; }
}

public class EarlyPaymentRequest
{
    public decimal CurrentBalance { get; set; }
    public decimal InterestRate { get; set; }
    public int RemainingTermMonths { get; set; }
    public decimal ExtraPaymentAmount { get; set; }
}

public class EarlyPaymentResult
{
    public int MonthsSaved { get; set; }
    public decimal InterestSaved { get; set; }
    public decimal TotalSaved { get; set; }
    public int NewTermMonths { get; set; }
}
