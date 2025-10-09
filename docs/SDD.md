# Software Design Document (SDD)
## KredyIo - Credit Comparison Platform

### 1. Introduction

#### 1.1 Purpose
This document describes the software design for the KredyIo credit comparison platform.

#### 1.2 Scope
This document covers the architectural design, component design, data design, and interface design.

### 2. System Architecture

#### 2.1 Architecture Overview
KredyIo follows a three-tier architecture:
- **Presentation Layer:** React SPA
- **Business Logic Layer:** .NET Core Web API
- **Data Layer:** Entity Framework Core + Database

```
┌─────────────────────────────────────────┐
│         React Frontend (Vercel)         │
│  - UI Components                        │
│  - State Management                     │
│  - API Client                           │
└──────────────────┬──────────────────────┘
                   │ HTTPS/REST
┌──────────────────▼──────────────────────┐
│      .NET Core Web API (Backend)        │
│  - Controllers                          │
│  - Services                             │
│  - Repositories                         │
│  - Data Aggregation                     │
└──────────────────┬──────────────────────┘
                   │ EF Core
┌──────────────────▼──────────────────────┐
│         Database (SQL Server)           │
│  - Products                             │
│  - Users                                │
│  - Comparisons                          │
│  - Content                              │
└─────────────────────────────────────────┘
```

#### 2.2 Design Patterns
- **Repository Pattern:** Data access abstraction
- **Service Layer Pattern:** Business logic encapsulation
- **Dependency Injection:** Loose coupling
- **Factory Pattern:** Object creation
- **Strategy Pattern:** Calculator implementations
- **Observer Pattern:** Notifications

### 3. Component Design

#### 3.1 Frontend Components

##### 3.1.1 Component Hierarchy
```
App
├── Layout
│   ├── Header
│   │   ├── Navigation
│   │   └── SearchBar
│   ├── Footer
│   └── Content
├── Pages
│   ├── HomePage
│   ├── ProductListPage
│   ├── ProductDetailPage
│   ├── ComparisonPage
│   ├── CalculatorPage
│   ├── ArticlePage
│   └── AdminDashboard
├── Features
│   ├── ProductCard
│   ├── ProductFilter
│   ├── ComparisonTable
│   ├── LoanCalculator
│   └── InterestCalculator
└── Common
    ├── Button
    ├── Input
    ├── Card
    └── Modal
```

##### 3.1.2 State Management
Using React Context API + useReducer:
- **ProductContext:** Product catalog, filters, search
- **ComparisonContext:** Selected products for comparison
- **UserContext:** User authentication state
- **NotificationContext:** User notifications

##### 3.1.3 Routing Structure
```
/                           -> HomePage
/products                   -> ProductListPage
/products/:id               -> ProductDetailPage
/compare                    -> ComparisonPage
/calculators/loan           -> LoanCalculator
/calculators/interest       -> InterestCalculator
/calculators/early-payment  -> EarlyPaymentCalculator
/articles                   -> ArticleListPage
/articles/:slug             -> ArticleDetailPage
/faq                        -> FAQPage
/admin                      -> AdminDashboard
```

#### 3.2 Backend Components

##### 3.2.1 Project Structure
```
KredyIo.API/
├── Controllers/
│   ├── ProductsController.cs
│   ├── ComparisonsController.cs
│   ├── CalculatorsController.cs
│   ├── AuthController.cs
│   └── ArticlesController.cs
├── Services/
│   ├── IProductService.cs
│   ├── ProductService.cs
│   ├── IComparisonService.cs
│   ├── ComparisonService.cs
│   ├── ICalculatorService.cs
│   ├── CalculatorService.cs
│   └── IDataAggregationService.cs
├── Repositories/
│   ├── IRepository.cs
│   ├── Repository.cs
│   └── IProductRepository.cs
├── Models/
│   ├── Entities/
│   │   ├── Product.cs
│   │   ├── User.cs
│   │   ├── Comparison.cs
│   │   └── Article.cs
│   └── DTOs/
│       ├── ProductDto.cs
│       ├── ComparisonDto.cs
│       └── CalculationRequestDto.cs
├── Data/
│   ├── ApplicationDbContext.cs
│   └── Migrations/
├── Middleware/
│   ├── ErrorHandlingMiddleware.cs
│   └── RateLimitingMiddleware.cs
└── Program.cs
```

##### 3.2.2 Controller Design

**ProductsController**
```csharp
[ApiController]
[Route("api/v1/[controller]")]
public class ProductsController : ControllerBase
{
    GET    /api/v1/products              -> GetProducts(filters)
    GET    /api/v1/products/{id}         -> GetProductById(id)
    POST   /api/v1/products              -> CreateProduct(dto) [Authorize(Admin)]
    PUT    /api/v1/products/{id}         -> UpdateProduct(id, dto) [Authorize(Admin)]
    DELETE /api/v1/products/{id}         -> DeleteProduct(id) [Authorize(Admin)]
    GET    /api/v1/products/compare      -> CompareProducts(ids)
}
```

**CalculatorsController**
```csharp
[ApiController]
[Route("api/v1/[controller]")]
public class CalculatorsController : ControllerBase
{
    POST /api/v1/calculators/loan-payment    -> CalculateLoanPayment(dto)
    POST /api/v1/calculators/interest        -> CalculateInterest(dto)
    POST /api/v1/calculators/early-payment   -> CalculateEarlyPayment(dto)
    POST /api/v1/calculators/affordability   -> CalculateAffordability(dto)
}
```

##### 3.2.3 Service Layer

**IProductService Interface**
```csharp
public interface IProductService
{
    Task<PagedResult<ProductDto>> GetProductsAsync(ProductFilter filter);
    Task<ProductDto> GetProductByIdAsync(Guid id);
    Task<ProductDto> CreateProductAsync(CreateProductDto dto);
    Task<ProductDto> UpdateProductAsync(Guid id, UpdateProductDto dto);
    Task<bool> DeleteProductAsync(Guid id);
    Task<List<ProductDto>> GetProductsForComparisonAsync(List<Guid> ids);
}
```

**ICalculatorService Interface**
```csharp
public interface ICalculatorService
{
    LoanPaymentResult CalculateLoanPayment(LoanPaymentRequest request);
    InterestResult CalculateInterest(InterestRequest request);
    EarlyPaymentResult CalculateEarlyPayment(EarlyPaymentRequest request);
    AffordabilityResult CalculateAffordability(AffordabilityRequest request);
}
```

##### 3.2.4 Repository Layer

**IRepository Interface (Generic)**
```csharp
public interface IRepository<T> where T : class
{
    Task<T> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
}
```

### 4. Data Design

#### 4.1 Database Schema

##### 4.1.1 Products Table
```sql
CREATE TABLE Products (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Type INT NOT NULL,
    LenderName NVARCHAR(200) NOT NULL,
    ProductName NVARCHAR(300) NOT NULL,
    InterestRate DECIMAL(5,2) NOT NULL,
    InterestType INT NOT NULL,
    MinAmount DECIMAL(18,2) NOT NULL,
    MaxAmount DECIMAL(18,2) NOT NULL,
    MinTerm INT NOT NULL,
    MaxTerm INT NOT NULL,
    Fees NVARCHAR(MAX),
    Features NVARCHAR(MAX),
    Eligibility NVARCHAR(MAX),
    Description NVARCHAR(MAX),
    ImageUrl NVARCHAR(500),
    CreatedAt DATETIME2 NOT NULL,
    UpdatedAt DATETIME2 NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    
    INDEX IX_Products_Type (Type),
    INDEX IX_Products_LenderName (LenderName),
    INDEX IX_Products_InterestRate (InterestRate),
    INDEX IX_Products_IsActive (IsActive)
);
```

##### 4.1.2 Users Table
```sql
CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Email NVARCHAR(256) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(256) NOT NULL,
    FirstName NVARCHAR(100),
    LastName NVARCHAR(100),
    CreatedAt DATETIME2 NOT NULL,
    UpdatedAt DATETIME2 NOT NULL,
    IsEmailVerified BIT NOT NULL DEFAULT 0,
    Role NVARCHAR(50) NOT NULL DEFAULT 'User',
    
    INDEX IX_Users_Email (Email)
);
```

##### 4.1.3 Comparisons Table
```sql
CREATE TABLE Comparisons (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NULL,
    Name NVARCHAR(200),
    ProductIds NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME2 NOT NULL,
    
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE SET NULL,
    INDEX IX_Comparisons_UserId (UserId)
);
```

##### 4.1.4 Articles Table
```sql
CREATE TABLE Articles (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Title NVARCHAR(300) NOT NULL,
    Slug NVARCHAR(300) NOT NULL UNIQUE,
    Content NVARCHAR(MAX) NOT NULL,
    Summary NVARCHAR(500),
    ImageUrl NVARCHAR(500),
    AuthorId UNIQUEIDENTIFIER NOT NULL,
    CreatedAt DATETIME2 NOT NULL,
    UpdatedAt DATETIME2 NOT NULL,
    PublishedAt DATETIME2,
    IsPublished BIT NOT NULL DEFAULT 0,
    ViewCount INT NOT NULL DEFAULT 0,
    
    FOREIGN KEY (AuthorId) REFERENCES Users(Id),
    INDEX IX_Articles_Slug (Slug),
    INDEX IX_Articles_IsPublished (IsPublished)
);
```

##### 4.1.5 FAQ Table
```sql
CREATE TABLE FAQs (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Question NVARCHAR(500) NOT NULL,
    Answer NVARCHAR(MAX) NOT NULL,
    Category NVARCHAR(100),
    DisplayOrder INT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL,
    UpdatedAt DATETIME2 NOT NULL,
    
    INDEX IX_FAQs_Category (Category),
    INDEX IX_FAQs_DisplayOrder (DisplayOrder)
);
```

### 5. Interface Design

#### 5.1 API Response Format

##### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully"
}
```

##### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": []
  }
}
```

##### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [ /* array of items */ ],
    "totalCount": 100,
    "pageNumber": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}
```

#### 5.2 Key API Contracts

##### Get Products
```
GET /api/v1/products?type=1&minRate=0&maxRate=5&page=1&pageSize=20

Response:
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "guid",
        "type": "PersonalLoan",
        "lenderName": "Bank Name",
        "productName": "Product Name",
        "interestRate": 1.5,
        "interestType": "Fixed",
        "minAmount": 10000,
        "maxAmount": 100000,
        "minTerm": 12,
        "maxTerm": 60,
        "features": ["Feature 1", "Feature 2"]
      }
    ],
    "totalCount": 50,
    "pageNumber": 1,
    "pageSize": 20,
    "totalPages": 3
  }
}
```

##### Calculate Loan Payment
```
POST /api/v1/calculators/loan-payment

Request:
{
  "amount": 50000,
  "interestRate": 1.5,
  "termMonths": 36
}

Response:
{
  "success": true,
  "data": {
    "monthlyPayment": 1453.32,
    "totalInterest": 2319.52,
    "totalAmount": 52319.52,
    "amortizationSchedule": [
      {
        "month": 1,
        "payment": 1453.32,
        "principal": 828.32,
        "interest": 625.00,
        "balance": 49171.68
      }
    ]
  }
}
```

### 6. Data Aggregation Design

#### 6.1 Data Sources
- Partner bank APIs (preferred)
- Web scraping (when permitted)
- Manual data entry (admin interface)

#### 6.2 Aggregation Service Architecture
```
┌────────────────────────────────────┐
│    Scheduled Job (Daily)           │
└──────────────┬─────────────────────┘
               │
┌──────────────▼─────────────────────┐
│   Data Aggregation Service         │
│   - Fetch from sources             │
│   - Validate data                  │
│   - Transform to common format     │
│   - Detect changes                 │
└──────────────┬─────────────────────┘
               │
┌──────────────▼─────────────────────┐
│   Database Update                  │
│   - Update existing products       │
│   - Create new products            │
│   - Archive discontinued products  │
└────────────────────────────────────┘
```

#### 6.3 Scraping Guidelines
- Respect robots.txt
- Implement rate limiting
- Use appropriate user agents
- Handle errors gracefully
- Cache results
- Monitor for changes in site structure

### 7. Security Design

#### 7.1 Authentication Flow
```
1. User submits credentials
2. API validates credentials
3. API generates JWT token (access + refresh)
4. Client stores tokens securely
5. Client includes access token in requests
6. API validates token on each request
7. Client refreshes token when expired
```

#### 7.2 Authorization Roles
- **Anonymous:** View products, use calculators
- **User:** Save favorites, create comparisons
- **Admin:** Manage products, content, users

#### 7.3 Security Measures
- Password hashing (BCrypt)
- JWT tokens with expiration
- HTTPS enforcement
- CORS configuration
- Rate limiting
- Input validation
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitization)
- CSRF protection

### 8. Deployment Architecture

#### 8.1 Production Environment
```
┌─────────────────────────────────────┐
│   Vercel (Frontend)                 │
│   - Static hosting                  │
│   - CDN distribution                │
│   - SSL/TLS                         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Azure App Service (Backend)       │
│   - Auto-scaling                    │
│   - Load balancing                  │
│   - Application Insights            │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Azure SQL Database                │
│   - Automated backups               │
│   - Geo-replication                 │
│   - Query performance insights      │
└─────────────────────────────────────┘
```

#### 8.2 CI/CD Pipeline
```
1. Developer pushes code to GitHub
2. GitHub Actions triggered
3. Run tests
4. Build frontend (React)
5. Build backend (.NET)
6. Deploy frontend to Vercel
7. Deploy backend to Azure
8. Run smoke tests
9. Notify team of deployment status
```

### 9. Performance Optimization

#### 9.1 Frontend Optimization
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies
- Minification and compression

#### 9.2 Backend Optimization
- Database indexing
- Query optimization
- Response caching (Redis)
- Async operations
- Connection pooling

#### 9.3 Monitoring
- Application Performance Monitoring (APM)
- Error tracking
- User analytics
- Server metrics
- Database performance
