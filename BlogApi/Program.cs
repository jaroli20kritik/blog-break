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
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<BlogDbContext>();
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
        Console.WriteLine($"🔍 Initializing Database with Connection: {connectionString}");

        // Ensure the directory for the DB exists
        var dbPath = connectionString.Split('=')[1];
        if (!Path.IsPathRooted(dbPath))
        {
            dbPath = Path.Combine(Directory.GetCurrentDirectory(), dbPath);
        }
        var dbFolder = Path.GetDirectoryName(dbPath);
        if (!string.IsNullOrEmpty(dbFolder) && !Directory.Exists(dbFolder))
        {
            Directory.CreateDirectory(dbFolder);
        }

        Console.WriteLine("🚀 Running Database Migrations...");
        context.Database.Migrate();
        Console.WriteLine("✅ Database migrated successfully.");

        // Additional check: Ensure table exists (sometimes Migrate doesn't create it if no migrations are found)
        if (!context.Database.CanConnect())
        {
             Console.WriteLine("❌ Cannot connect to database.");
        }

        var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        if (!Directory.Exists(uploadsPath))
        {
             Directory.CreateDirectory(uploadsPath);
             Console.WriteLine("📁 Created uploads folder.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"🔥 STARTUP ERROR: {ex.Message}");
        Console.WriteLine($"🔥 STACK TRACE: {ex.StackTrace}");
    }
}

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
