using CompraLatino.Api.Dtos;
using CompraLatino.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CompraLatino.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly BiService _bi;
    private readonly OrderService _orders;

    public AdminController(BiService bi, OrderService orders)
    {
        _bi = bi;
        _orders = orders;
    }

    [HttpGet("bi/dashboard")]
    public async Task<ActionResult<BiDashboardDto>> Dashboard() => Ok(await _bi.GetDashboardAsync());

    [HttpGet("orders")]
    public async Task<ActionResult<List<OrderDto>>> Orders() => Ok(await _orders.GetAllAsync());
}
