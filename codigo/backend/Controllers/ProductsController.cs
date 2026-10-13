using CompraLatino.Api.Dtos;
using CompraLatino.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace CompraLatino.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly CatalogService _catalog;

    public ProductsController(CatalogService catalog)
    {
        _catalog = catalog;
    }

    [HttpGet]
    public async Task<ActionResult<List<ProductDto>>> Search([FromQuery] string? q, [FromQuery] string? category)
        => Ok(await _catalog.SearchAsync(q, category));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductDto>> Get(int id)
    {
        var item = await _catalog.GetByIdAsync(id);
        return item is null ? NotFound() : Ok(item);
    }
}
