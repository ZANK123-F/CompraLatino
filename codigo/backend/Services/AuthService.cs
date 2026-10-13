using CompraLatino.Api.Data;
using CompraLatino.Api.Domain;
using CompraLatino.Api.Dtos;
using Microsoft.EntityFrameworkCore;

namespace CompraLatino.Api.Services;

public class AuthService
{
    private readonly AppDbContext _db;
    private readonly TokenService _tokens;

    public AuthService(AppDbContext db, TokenService tokens)
    {
        _db = db;
        _tokens = tokens;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        if (await _db.Users.AnyAsync(x => x.Email == email))
            throw new InvalidOperationException("El correo ya esta registrado.");

        var user = new UserProfile
        {
            Email = email,
            FullName = request.FullName.Trim(),
            FirebaseUid = $"uid-{Guid.NewGuid():N}",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "Customer"
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        return new AuthResponse(_tokens.CreateToken(user), user.Email, user.FullName, user.Role, user.FirebaseUid);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _db.Users.FirstOrDefaultAsync(x => x.Email == email)
            ?? throw new InvalidOperationException("Credenciales invalidas.");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new InvalidOperationException("Credenciales invalidas.");

        return new AuthResponse(_tokens.CreateToken(user), user.Email, user.FullName, user.Role, user.FirebaseUid);
    }
}
