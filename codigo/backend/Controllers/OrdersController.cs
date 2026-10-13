using System.Security.Claims;
using CompraLatino.Api.Dtos;
using CompraLatino.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CompraLatino.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly OrderService _orders;

    public OrdersController(OrderService orders)
    {
        _orders = orders;
    }

    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private bool IsAdmin => User.IsInRole("Admin");

    [Authorize]
    [HttpPost("checkout")]
    public async Task<ActionResult<CheckoutResponse>> Checkout(CreateOrderRequest request)
    {
        try { return Ok(await _orders.CreateCheckoutAsync(UserId, request)); }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [Authorize]
    [HttpGet("mine")]
    public async Task<ActionResult<List<OrderDto>>> Mine() => Ok(await _orders.GetForUserAsync(UserId));

    [Authorize]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderDto>> Get(int id)
    {
        var order = await _orders.GetByIdAsync(id, UserId, IsAdmin);
        return order is null ? NotFound() : Ok(order);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult<List<OrderDto>>> All() => Ok(await _orders.GetAllAsync());
}
