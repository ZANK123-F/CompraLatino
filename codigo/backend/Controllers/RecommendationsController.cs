using System.Security.Claims;
using CompraLatino.Api.Dtos;
using CompraLatino.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CompraLatino.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecommendationsController : ControllerBase
{
    private readonly RecommendationService _recommendations;

    public RecommendationsController(RecommendationService recommendations)
    {
        _recommendations = recommendations;
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<RecommendationDto>>> Get()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return Ok(await _recommendations.GetForUserAsync(userId));
    }
}
