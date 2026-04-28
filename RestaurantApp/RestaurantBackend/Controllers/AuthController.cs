using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RestaurantBackend.Data;
using RestaurantBackend.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RestaurantBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly RestaurantDbContext _context;
    private const string JwtKey = "SaisagarSuperSecretKey2024@Restaurant!XYZ";

    public AuthController(RestaurantDbContext context)
    {
        _context = context;
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username);

        if (user == null)
            return Unauthorized(new { message = "Invalid username or password" });

        // Check plain-text first (for seeded dev accounts), then BCrypt
        bool valid = false;
        if (user.PasswordHash == request.Password)
        {
            valid = true;
        }
        else
        {
            try { 
                valid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash); 
            }
            catch { 
                valid = false; 
            }
        }

        if (!valid)
            return Unauthorized(new { message = "Invalid username or password" });

        var token = GenerateJwtToken(user);
        return Ok(new { 
            token, 
            username = user.Username, 
            role = user.Role,
            userId = user.Id
        });
    }

    [HttpPost("register")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Owner")]
    public async Task<IActionResult> Register([FromBody] LoginRequest request)
    {
        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            return BadRequest(new { message = "Username already exists" });

        string hash;
        try {
            hash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        } catch {
            hash = request.Password; // fallback
        }

        var user = new AppUser {
            Username = request.Username,
            PasswordHash = hash,
            Role = "Owner"
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return Ok(new { message = "User created", userId = user.Id });
    }

    private string GenerateJwtToken(AppUser user)
    {
        var claims = new[] {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
