# Deployment Guide - KredyIo

This guide covers deploying the KredyIo platform to production.

## Prerequisites

- Vercel account (for frontend)
- Azure/AWS account (for backend) or any .NET hosting service
- Database hosting (Azure SQL, AWS RDS, or similar)
- Domain name (optional)

## Frontend Deployment (Vercel)

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to frontend directory:
```bash
cd frontend
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts to configure your project

5. For production deployment:
```bash
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Set root directory to `frontend`
5. Vercel will auto-detect React and configure build settings
6. Add environment variable:
   - `REACT_APP_API_URL` = your backend API URL
7. Click "Deploy"

### Environment Variables for Vercel

```
REACT_APP_API_URL=https://your-backend-api.com
```

## Backend Deployment

### Option 1: Azure App Service

1. **Create Azure App Service:**
```bash
az webapp create \
  --resource-group kredyio-rg \
  --plan kredyio-plan \
  --name kredyio-api \
  --runtime "DOTNET:9.0"
```

2. **Configure Database Connection:**
```bash
az webapp config appsettings set \
  --resource-group kredyio-rg \
  --name kredyio-api \
  --settings ConnectionStrings__DefaultConnection="your-connection-string"
```

3. **Deploy:**
```bash
cd backend/KredyIo.API
dotnet publish -c Release
az webapp deployment source config-zip \
  --resource-group kredyio-rg \
  --name kredyio-api \
  --src publish.zip
```

### Option 2: Docker Container

1. **Create Dockerfile in backend/KredyIo.API:**
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["KredyIo.API.csproj", "./"]
RUN dotnet restore "KredyIo.API.csproj"
COPY . .
RUN dotnet build "KredyIo.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "KredyIo.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "KredyIo.API.dll"]
```

2. **Build Docker image:**
```bash
docker build -t kredyio-api:latest .
```

3. **Run container:**
```bash
docker run -d -p 80:80 \
  -e ConnectionStrings__DefaultConnection="your-connection-string" \
  kredyio-api:latest
```

4. **Push to container registry and deploy to cloud:**
```bash
# Azure Container Registry
az acr build --registry kredyio --image kredyio-api:latest .

# Deploy to Azure Container Instances
az container create \
  --resource-group kredyio-rg \
  --name kredyio-api \
  --image kredyio.azurecr.io/kredyio-api:latest \
  --dns-name-label kredyio-api \
  --ports 80
```

### Option 3: AWS Elastic Beanstalk

1. **Install EB CLI:**
```bash
pip install awsebcli
```

2. **Initialize:**
```bash
cd backend/KredyIo.API
eb init -p "64bit Amazon Linux 2 v2.x.x running .NET Core" kredyio-api
```

3. **Create environment:**
```bash
eb create kredyio-api-env
```

4. **Set environment variables:**
```bash
eb setenv ConnectionStrings__DefaultConnection="your-connection-string"
```

5. **Deploy:**
```bash
dotnet publish -c Release
eb deploy
```

## Database Setup

### Azure SQL Database

1. **Create database:**
```bash
az sql server create \
  --name kredyio-sql \
  --resource-group kredyio-rg \
  --location eastus \
  --admin-user sqladmin \
  --admin-password "YourPassword123!"

az sql db create \
  --resource-group kredyio-rg \
  --server kredyio-sql \
  --name kredyio-db \
  --service-objective S0
```

2. **Get connection string:**
```bash
az sql db show-connection-string \
  --client ado.net \
  --server kredyio-sql \
  --name kredyio-db
```

3. **Configure firewall:**
```bash
az sql server firewall-rule create \
  --resource-group kredyio-rg \
  --server kredyio-sql \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### Run Migrations

Update `Program.cs` to use SQL Server instead of In-Memory:

```csharp
// Replace
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseInMemoryDatabase("KredyIoDb"));

// With
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
```

Create and apply migrations:
```bash
cd backend/KredyIo.API
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '9.0.x'
      
      - name: Build
        run: |
          cd backend/KredyIo.API
          dotnet publish -c Release -o ./publish
      
      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: kredyio-api
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: backend/KredyIo.API/publish

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Build
        run: |
          cd frontend
          npm ci
          npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
```

## Post-Deployment Configuration

### 1. Update CORS Origins

In `Program.cs`, update CORS to include production URLs:

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "https://kredyio.vercel.app",
            "https://kredyio.com"  // Your custom domain
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});
```

### 2. Enable HTTPS Redirect

Ensure HTTPS redirect is enabled in production:

```csharp
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
```

### 3. Configure Logging

Update `appsettings.Production.json`:

```json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "System": "Warning"
      }
    }
  }
}
```

### 4. Set Up Health Checks

Add health check endpoint:

```csharp
// In Program.cs
builder.Services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>();

app.MapHealthChecks("/health");
```

### 5. Configure Monitoring

Set up Application Insights or similar monitoring:

```bash
az monitor app-insights component create \
  --app kredyio-insights \
  --location eastus \
  --resource-group kredyio-rg
```

Add to `appsettings.json`:
```json
{
  "ApplicationInsights": {
    "InstrumentationKey": "your-key-here"
  }
}
```

## Domain Configuration

### Custom Domain for Frontend (Vercel)

1. Go to Vercel dashboard
2. Select your project
3. Go to Settings > Domains
4. Add your custom domain
5. Update DNS records as instructed

### Custom Domain for Backend

1. Add custom domain to Azure App Service or your hosting provider
2. Configure SSL certificate (Let's Encrypt or Azure managed certificate)
3. Update DNS records

## Security Checklist

- [ ] Use HTTPS for all connections
- [ ] Store secrets in Azure Key Vault or AWS Secrets Manager
- [ ] Enable authentication for admin endpoints
- [ ] Configure rate limiting
- [ ] Enable CORS only for specific origins
- [ ] Implement API key authentication for public APIs
- [ ] Regular security updates and patches
- [ ] Enable database encryption at rest
- [ ] Configure backup and disaster recovery
- [ ] Set up monitoring and alerts

## Monitoring and Maintenance

### Set Up Alerts

```bash
# Azure example
az monitor metrics alert create \
  --name 'High Response Time' \
  --resource-group kredyio-rg \
  --scopes /subscriptions/{sub-id}/resourceGroups/kredyio-rg/providers/Microsoft.Web/sites/kredyio-api \
  --condition "avg HttpResponseTime > 1000" \
  --description "Alert when response time exceeds 1 second"
```

### Regular Maintenance Tasks

1. **Daily:**
   - Check error logs
   - Monitor API response times
   - Review database performance

2. **Weekly:**
   - Review and update product data
   - Check for security updates
   - Review usage analytics

3. **Monthly:**
   - Database backup verification
   - Performance optimization
   - Security audit
   - Cost review

## Rollback Procedure

### Frontend (Vercel)
```bash
vercel rollback
```

### Backend (Azure)
```bash
az webapp deployment slot swap \
  --resource-group kredyio-rg \
  --name kredyio-api \
  --slot staging \
  --target-slot production
```

## Troubleshooting

### Frontend Issues

1. **Build fails on Vercel:**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check environment variables

2. **API calls fail:**
   - Verify REACT_APP_API_URL is correct
   - Check CORS configuration on backend
   - Verify backend is accessible

### Backend Issues

1. **Application won't start:**
   - Check connection string
   - Verify database is accessible
   - Check logs for errors

2. **Database connection fails:**
   - Verify firewall rules
   - Check connection string format
   - Ensure database exists

3. **High response times:**
   - Check database query performance
   - Review application logs
   - Consider adding caching

## Support

For deployment issues:
- Check logs: `az webapp log tail --name kredyio-api --resource-group kredyio-rg`
- Review documentation: [Azure Docs](https://docs.microsoft.com/azure)
- Contact support: info@kredyio.com
