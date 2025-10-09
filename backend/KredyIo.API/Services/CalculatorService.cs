using KredyIo.API.Models.DTOs;

namespace KredyIo.API.Services;

public interface ICalculatorService
{
    LoanPaymentResult CalculateLoanPayment(LoanPaymentRequest request);
    InterestResult CalculateInterest(InterestRequest request);
    EarlyPaymentResult CalculateEarlyPayment(EarlyPaymentRequest request);
}

public class CalculatorService : ICalculatorService
{
    public LoanPaymentResult CalculateLoanPayment(LoanPaymentRequest request)
    {
        if (request.Amount <= 0)
            throw new ArgumentException("Amount must be positive", nameof(request.Amount));
        if (request.InterestRate < 0)
            throw new ArgumentException("Interest rate cannot be negative", nameof(request.InterestRate));
        if (request.TermMonths <= 0)
            throw new ArgumentException("Term must be at least 1 month", nameof(request.TermMonths));

        var result = new LoanPaymentResult();
        var monthlyRate = request.InterestRate / 100 / 12;

        if (request.InterestRate == 0)
        {
            result.MonthlyPayment = request.Amount / request.TermMonths;
            result.TotalInterest = 0;
            result.TotalAmount = request.Amount;
        }
        else
        {
            // Monthly payment formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
            var power = Math.Pow(1 + (double)monthlyRate, request.TermMonths);
            result.MonthlyPayment = request.Amount * (monthlyRate * (decimal)power) / ((decimal)power - 1);
            result.TotalAmount = result.MonthlyPayment * request.TermMonths;
            result.TotalInterest = result.TotalAmount - request.Amount;
        }

        // Generate amortization schedule
        var balance = request.Amount;
        for (int i = 1; i <= request.TermMonths; i++)
        {
            var interest = balance * monthlyRate;
            var principal = result.MonthlyPayment - interest;
            balance -= principal;

            if (balance < 0) balance = 0;

            result.AmortizationSchedule.Add(new AmortizationEntry
            {
                Month = i,
                Payment = Math.Round(result.MonthlyPayment, 2),
                Principal = Math.Round(principal, 2),
                Interest = Math.Round(interest, 2),
                Balance = Math.Round(balance, 2)
            });
        }

        result.MonthlyPayment = Math.Round(result.MonthlyPayment, 2);
        result.TotalInterest = Math.Round(result.TotalInterest, 2);
        result.TotalAmount = Math.Round(result.TotalAmount, 2);

        return result;
    }

    public InterestResult CalculateInterest(InterestRequest request)
    {
        if (request.Principal <= 0)
            throw new ArgumentException("Principal must be positive", nameof(request.Principal));
        if (request.Rate < 0)
            throw new ArgumentException("Rate cannot be negative", nameof(request.Rate));
        if (request.Time <= 0)
            throw new ArgumentException("Time must be positive", nameof(request.Time));

        var result = new InterestResult();

        // Simple Interest: I = P * r * t
        result.SimpleInterest = request.Principal * (request.Rate / 100) * request.Time;
        result.TotalWithSimple = request.Principal + result.SimpleInterest;

        // Compound Interest: A = P(1 + r/n)^(nt)
        var rate = (double)(request.Rate / 100);
        var compoundAmount = request.Principal * (decimal)Math.Pow(
            1 + rate / request.CompoundFrequency,
            request.CompoundFrequency * (double)request.Time);
        result.CompoundInterest = compoundAmount - request.Principal;
        result.TotalWithCompound = compoundAmount;

        result.SimpleInterest = Math.Round(result.SimpleInterest, 2);
        result.CompoundInterest = Math.Round(result.CompoundInterest, 2);
        result.TotalWithSimple = Math.Round(result.TotalWithSimple, 2);
        result.TotalWithCompound = Math.Round(result.TotalWithCompound, 2);

        return result;
    }

    public EarlyPaymentResult CalculateEarlyPayment(EarlyPaymentRequest request)
    {
        if (request.CurrentBalance <= 0)
            throw new ArgumentException("Current balance must be positive", nameof(request.CurrentBalance));
        if (request.InterestRate < 0)
            throw new ArgumentException("Interest rate cannot be negative", nameof(request.InterestRate));
        if (request.RemainingTermMonths <= 0)
            throw new ArgumentException("Remaining term must be at least 1 month", nameof(request.RemainingTermMonths));
        if (request.ExtraPaymentAmount <= 0)
            throw new ArgumentException("Extra payment must be positive", nameof(request.ExtraPaymentAmount));

        var result = new EarlyPaymentResult();
        var monthlyRate = request.InterestRate / 100 / 12;

        // Calculate original monthly payment
        var power = Math.Pow(1 + (double)monthlyRate, request.RemainingTermMonths);
        var monthlyPayment = request.CurrentBalance * (monthlyRate * (decimal)power) / ((decimal)power - 1);

        // Calculate total with original payment
        var originalTotal = monthlyPayment * request.RemainingTermMonths;

        // Calculate new payment with extra amount
        var newMonthlyPayment = monthlyPayment + request.ExtraPaymentAmount;

        // Calculate new term
        var balance = request.CurrentBalance;
        var months = 0;
        while (balance > 0 && months < request.RemainingTermMonths)
        {
            var interest = balance * monthlyRate;
            var principal = newMonthlyPayment - interest;
            balance -= principal;
            months++;

            if (balance < 0) balance = 0;
        }

        result.NewTermMonths = months;
        result.MonthsSaved = request.RemainingTermMonths - months;
        
        var newTotal = newMonthlyPayment * months;
        result.TotalSaved = originalTotal - newTotal;
        result.InterestSaved = result.TotalSaved;

        return result;
    }
}
