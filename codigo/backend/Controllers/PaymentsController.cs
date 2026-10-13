using CompraLatino.Api.Dtos;
using CompraLatino.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace CompraLatino.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly OrderService _orders;
    private readonly WompiClient _wompi;

    public PaymentsController(OrderService orders, WompiClient wompi)
    {
        _orders = orders;
        _wompi = wompi;
    }

    [HttpPost("wompi/webhook")]
    public async Task<ActionResult<OrderDto>> Webhook(WompiWebhookRequest request)
    {
        try { return Ok(await _orders.ConfirmWompiAsync(request)); }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPost("wompi/simulate")]
    public async Task<ActionResult<OrderDto>> Simulate([FromBody] SimulatePaymentRequest request)
    {
        var status = string.IsNullOrWhiteSpace(request.Status) ? "Approved" : request.Status;
        var signature = _wompi.Sign(request.TransactionId, status);
        try
        {
            return Ok(await _orders.ConfirmWompiAsync(new WompiWebhookRequest(request.TransactionId, status, signature)));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}

public record SimulatePaymentRequest(string TransactionId, string? Status);
