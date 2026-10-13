using System.Security.Claims;
using CompraLatino.Api.Dtos;
using CompraLatino.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CompraLatino.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _auth;

    public AuthController(AuthService auth)
    {
        _auth = auth;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        try { return Ok(await _auth.RegisterAsync(request)); }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        try { return Ok(await _auth.LoginAsync(request)); }
        catch (InvalidOperationException ex) { return Unauthorized(new { message = ex.Message }); }
    }

    [Authorize]
    [HttpGet("me")]
    public ActionResult<object> Me()
    {
        return Ok(new
        {
            id = User.FindFirstValue(ClaimTypes.NameIdentifier),
            email = User.FindFirstValue(ClaimTypes.Email) ?? User.FindFirstValue("email"),
            role = User.FindFirstValue(ClaimTypes.Role),
            firebaseUid = User.FindFirstValue("firebase_uid"),
            fullName = User.FindFirstValue("full_name")
        });
    }
}
