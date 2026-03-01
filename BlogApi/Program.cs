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

// 1. Move Exception Handler to the very top
app.UseDeveloperExceptionPage();

// 2. Global Exception Handler for JSON responses
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { 
            error = ex.Message, 
            stackTrace = ex.StackTrace,
            innerException = ex.InnerException?.Message 
        });
    }
});

// 3. Simple Health Checks
app.MapGet("/", () => "API is running! 🚀");
app.MapGet("/health", () => Results.Ok(new { status = "Healthy", time = DateTime.UtcNow }));
app.MapGet("/api/health", () => Results.Ok(new { status = "Healthy (API Prefix)", time = DateTime.UtcNow }));

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
        
        try {
            Log("🚀 Attempting Migrate()...");
            context.Database.Migrate();
            Log("✅ Migrate() complete.");
        } catch (Exception ex) {
            Log($"⚠️ Migrate() failed: {ex.Message}. Trying EnsureCreated()...");
            context.Database.EnsureCreated();
            Log("✅ EnsureCreated() complete.");
        }

        // Verify Table Existence
        try {
            var count = context.Posts.Count();
            Log($"✅ Verification: 'Posts' table exists (count={count}).");
        } catch (Exception ex) {
            Log($"❌ Verification FAILED: {ex.Message}. Table still missing!");
        }

        var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        if (!Directory.Exists(uploadsPath)) {
            Directory.CreateDirectory(uploadsPath);
            Log("📁 Created uploads folder.");
        }
    }
    catch (Exception ex) {
        Log($"🔥 FATAL STARTUP ERROR: {ex.Message}");
    }
}

app.MapGet("/api/debug", () => startupLogs);

app.UseCors("AllowAll");
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
