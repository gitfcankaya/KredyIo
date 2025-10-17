using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using KredyIo.API.Data;
using KredyIo.API.Services;
using KredyIo.API.Services.Scraping;
using KredyIo.API.Services.Scraping.Interfaces;
using KredyIo.API.Services.Scraping.Scrapers;
using Hangfire;
using Hangfire.MemoryStorage;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "http://localhost:5173",
            "https://localhost:3000",
            "https://localhost:5173"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

// Configure JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "YourSuperSecretKeyHere123456789012345678901234567890";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "KredyIo";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "KredyIo";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

builder.Services.AddAuthorization();


// Configure Database (MSSQL)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure Hangfire
builder.Services.AddHangfire(configuration => configuration
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseMemoryStorage());

builder.Services.AddHangfireServer();

// Register services
builder.Services.AddScoped<ICalculatorService, CalculatorService>();
builder.Services.AddScoped<DataAggregationService>();

// Register HttpClient
builder.Services.AddHttpClient();

// Register scraping services
builder.Services.AddScoped<IScrapingJobService, ScrapingJobService>();
builder.Services.AddScoped<TcmbCurrencyRateScraper>();
builder.Services.AddScoped<BigParaGoldPriceScraper>();

var app = builder.Build();

// Seed database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    // Ensure database is deleted and recreated for development
    if (app.Environment.IsDevelopment())
    {
        context.Database.EnsureDeleted();
    }

    context.Database.EnsureCreated();

    // Seed initial data
    SeedData.InitializeAsync(context).Wait();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    // Add Hangfire Dashboard for development
    app.UseHangfireDashboard("/hangfire");
}

app.UseSerilogRequestLogging();
app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
