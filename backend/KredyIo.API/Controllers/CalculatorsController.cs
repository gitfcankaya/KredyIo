using Microsoft.AspNetCore.Mvc;
using KredyIo.API.Models.DTOs;
using KredyIo.API.Services;

namespace KredyIo.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class CalculatorsController : ControllerBase
{
    private readonly ICalculatorService _calculatorService;
    private readonly ILogger<CalculatorsController> _logger;

    public CalculatorsController(
        ICalculatorService calculatorService,
        ILogger<CalculatorsController> logger)
    {
        _calculatorService = calculatorService;
        _logger = logger;
    }

    [HttpPost("loan-payment")]
    public ActionResult<LoanPaymentResult> CalculateLoanPayment([FromBody] LoanPaymentRequest request)
    {
        try
        {
            var result = _calculatorService.CalculateLoanPayment(request);
            return Ok(new { success = true, data = result });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid input for loan payment calculation");
            return BadRequest(new { success = false, error = new { message = ex.Message } });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating loan payment");
            return StatusCode(500, new { success = false, error = new { message = "An error occurred" } });
        }
    }

    [HttpPost("interest")]
    public ActionResult<InterestResult> CalculateInterest([FromBody] InterestRequest request)
    {
        try
        {
            var result = _calculatorService.CalculateInterest(request);
            return Ok(new { success = true, data = result });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid input for interest calculation");
            return BadRequest(new { success = false, error = new { message = ex.Message } });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating interest");
            return StatusCode(500, new { success = false, error = new { message = "An error occurred" } });
        }
    }

    [HttpPost("early-payment")]
    public ActionResult<EarlyPaymentResult> CalculateEarlyPayment([FromBody] EarlyPaymentRequest request)
    {
        try
        {
            var result = _calculatorService.CalculateEarlyPayment(request);
            return Ok(new { success = true, data = result });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid input for early payment calculation");
            return BadRequest(new { success = false, error = new { message = ex.Message } });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating early payment");
            return StatusCode(500, new { success = false, error = new { message = "An error occurred" } });
        }
    }
}
