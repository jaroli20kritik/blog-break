using Microsoft.EntityFrameworkCore;
using BlogApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<BlogDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// 1. CORS MUST BE FIRST (so errors still have CORS headers)
app.UseCors("AllowAll");

// 2. Exception Handler with CORS headers
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        // Add CORS headers manually to error responses if needed
        context.Response.Headers.Append("Access-Control-Allow-Origin", "*");
        
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { 
            error = ex.Message, 
            type = ex.GetType().Name,
            stackTrace = ex.StackTrace,
            innerException = ex.InnerException?.Message 
        });
    }
});

app.UseDeveloperExceptionPage();

// 3. Simple Health Checks
app.MapGet("/", () => "API is running! 🚀 (v2)");
app.MapGet("/health", () => Results.Ok(new { status = "Healthy", time = DateTime.UtcNow }));

// 4. DB Migration and Startup Logic
var startupLogs = new List<string>();
void Log(string msg) { 
    Console.WriteLine(msg); 
    startupLogs.Add($"{DateTime.UtcNow:HH:mm:ss} - {msg}"); 
}

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<BlogDbContext>();
        Log("🔍 DATABASE INIT START");
        
        Log("🚀 Running Database Migrations (Migrate)...");
        context.Database.Migrate();
        Log("✅ Migrate() complete.");

        // Verification
        var count = context.Posts.Count();
        Log($"✅ Verification: 'Posts' table exists (count={count}).");

        var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        if (!Directory.Exists(uploadsPath)) {
            Directory.CreateDirectory(uploadsPath);
            Log("📁 Created uploads folder.");
        }
    }
    catch (Exception ex) {
        Log($"🔥 STARTUP ERROR: {ex.Message}");
        Log($"🔥 STACK: {ex.StackTrace}");
    }
}

app.MapGet("/api/debug", () => startupLogs);

app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseAuthorization();
app.MapControllers();
app.Run();
