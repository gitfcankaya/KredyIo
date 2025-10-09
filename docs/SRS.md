# Software Requirements Specification (SRS)
## KredyIo - Credit Comparison Platform

### 1. Introduction

#### 1.1 Purpose
This SRS document specifies the software requirements for the KredyIo credit comparison platform.

#### 1.2 Scope
KredyIo is a web-based platform that provides credit product information, comparison tools, and financial calculators.

#### 1.3 Definitions and Acronyms
- **API:** Application Programming Interface
- **UI:** User Interface
- **CRUD:** Create, Read, Update, Delete
- **APR:** Annual Percentage Rate
- **EF Core:** Entity Framework Core

### 2. Overall Description

#### 2.1 Product Perspective
KredyIo is a standalone web application consisting of:
- React-based frontend (SPA)
- .NET Core Web API backend
- SQL Server database
- Data aggregation services

#### 2.2 Product Functions
- Display and search credit products
- Compare multiple products
- Calculate loan payments and costs
- Aggregate data from multiple sources
- Provide educational content

#### 2.3 User Characteristics
- General consumers with varying levels of financial literacy
- Age range: 18-65
- Device usage: Mobile (60%), Desktop (30%), Tablet (10%)

### 3. Functional Requirements

#### 3.1 Credit Product Management

**FR-1.1:** System shall store credit product information
- Product type (loan, credit card, mortgage, etc.)
- Bank/lender name
- Interest rate (fixed/variable)
- Loan term options
- Minimum/maximum amounts
- Fees and charges
- Eligibility criteria

**FR-1.2:** System shall support CRUD operations for products
- Administrators can create, update, delete products
- Users can read product information

**FR-1.3:** System shall categorize products
- By type (personal loan, mortgage, etc.)
- By lender
- By interest rate range
- By loan amount range

#### 3.2 Search and Filter

**FR-2.1:** System shall provide search functionality
- Search by product name
- Search by lender name
- Search by keywords

**FR-2.2:** System shall provide filter options
- Filter by product type
- Filter by interest rate range
- Filter by loan amount
- Filter by term length
- Filter by lender

**FR-2.3:** System shall provide sorting options
- Sort by interest rate (low to high, high to low)
- Sort by popularity
- Sort by newest first

#### 3.3 Comparison Features

**FR-3.1:** System shall allow users to select products for comparison
- Users can select up to 5 products
- Selection persists during session

**FR-3.2:** System shall display comparison table
- Side-by-side comparison
- Highlight differences
- Show key metrics (APR, monthly payment, total cost)

**FR-3.3:** System shall allow comparison customization
- Users can select which attributes to compare
- Users can save comparisons

#### 3.4 Calculators

**FR-4.1:** Loan Payment Calculator
- Input: loan amount, interest rate, term
- Output: monthly payment, total interest, total cost

**FR-4.2:** Interest Calculator
- Input: principal, rate, time
- Output: simple interest, compound interest

**FR-4.3:** Early Payment Calculator
- Input: current loan details, extra payment amount
- Output: time saved, interest saved

**FR-4.4:** Affordability Calculator
- Input: income, expenses, down payment
- Output: maximum affordable loan amount

#### 3.5 Data Aggregation

**FR-5.1:** System shall support automated data collection
- Scheduled data refresh (daily)
- API integration with data sources
- Web scraping capabilities (where permitted)

**FR-5.2:** System shall validate collected data
- Check for required fields
- Validate data formats
- Flag anomalies for review

**FR-5.3:** System shall maintain data history
- Track rate changes over time
- Store historical product data

#### 3.6 User Management

**FR-6.1:** System shall support user registration (optional)
- Email/password authentication
- Email verification
- Password reset functionality

**FR-6.2:** System shall support user profiles
- Save favorite products
- Save comparison lists
- Store preferences

**FR-6.3:** System shall support notifications
- Rate change alerts
- New product alerts

#### 3.7 Content Management

**FR-7.1:** System shall support articles and guides
- CRUD operations for content
- Rich text editing
- Image uploads
- SEO metadata

**FR-7.2:** System shall support FAQ management
- Question and answer pairs
- Categories
- Search functionality

### 4. Non-Functional Requirements

#### 4.1 Performance
**NFR-1.1:** Page load time shall be < 3 seconds
**NFR-1.2:** API response time shall be < 500ms
**NFR-1.3:** System shall support 1000+ concurrent users

#### 4.2 Security
**NFR-2.1:** All data transmission shall use HTTPS
**NFR-2.2:** Passwords shall be hashed using industry-standard algorithms
**NFR-2.3:** System shall implement rate limiting
**NFR-2.4:** System shall protect against common vulnerabilities (OWASP Top 10)

#### 4.3 Usability
**NFR-3.1:** UI shall be responsive (mobile, tablet, desktop)
**NFR-3.2:** System shall be accessible (WCAG 2.1 Level AA)
**NFR-3.3:** UI shall support Turkish language

#### 4.4 Reliability
**NFR-4.1:** System shall have 99.9% uptime
**NFR-4.2:** System shall implement error handling and logging
**NFR-4.3:** System shall recover gracefully from failures

#### 4.5 Maintainability
**NFR-5.1:** Code shall follow established coding standards
**NFR-5.2:** System shall be modular and loosely coupled
**NFR-5.3:** System shall include comprehensive documentation

#### 4.6 Scalability
**NFR-6.1:** System shall scale horizontally
**NFR-6.2:** Database shall support sharding if needed
**NFR-6.3:** System shall use caching for frequently accessed data

### 5. System Architecture

#### 5.1 Frontend
- React 18+
- TypeScript
- Redux or Context API for state management
- Tailwind CSS or Material-UI for styling
- Axios for HTTP requests
- React Router for navigation

#### 5.2 Backend
- .NET Core 8.0+
- ASP.NET Core Web API
- Entity Framework Core
- JWT authentication
- AutoMapper
- Serilog for logging

#### 5.3 Database
- SQL Server or PostgreSQL
- Entity Framework Core migrations
- Indexed queries for performance

#### 5.4 Deployment
- Frontend: Vercel
- Backend: Azure App Service or similar
- Database: Managed database service
- CI/CD: GitHub Actions

### 6. Data Requirements

#### 6.1 Credit Product Entity
```
- Id (GUID)
- Type (enum: PersonalLoan, CreditCard, Mortgage, AutoLoan, BusinessLoan)
- LenderName (string)
- ProductName (string)
- InterestRate (decimal)
- InterestType (enum: Fixed, Variable)
- MinAmount (decimal)
- MaxAmount (decimal)
- MinTerm (int, months)
- MaxTerm (int, months)
- Fees (JSON)
- Features (JSON)
- Eligibility (JSON)
- CreatedAt (DateTime)
- UpdatedAt (DateTime)
- IsActive (bool)
```

#### 6.2 User Entity
```
- Id (GUID)
- Email (string)
- PasswordHash (string)
- FirstName (string)
- LastName (string)
- CreatedAt (DateTime)
- UpdatedAt (DateTime)
- IsEmailVerified (bool)
```

#### 6.3 Comparison Entity
```
- Id (GUID)
- UserId (GUID, nullable)
- Name (string)
- ProductIds (JSON array)
- CreatedAt (DateTime)
```

### 7. External Interface Requirements

#### 7.1 User Interfaces
- Home page with search and featured products
- Product listing page with filters
- Product detail page
- Comparison page
- Calculator pages
- Content pages (guides, FAQ)
- Admin dashboard

#### 7.2 API Interfaces
- RESTful API with JSON
- Authentication: JWT Bearer tokens
- Versioning: URL-based (/api/v1/)
- Documentation: Swagger/OpenAPI

#### 7.3 Third-Party Integrations
- Email service (SendGrid, AWS SES)
- Analytics (Google Analytics)
- Error tracking (Sentry)

### 8. Appendices

#### 8.1 API Endpoints Summary
```
GET    /api/v1/products
GET    /api/v1/products/{id}
POST   /api/v1/products (admin)
PUT    /api/v1/products/{id} (admin)
DELETE /api/v1/products/{id} (admin)

GET    /api/v1/products/compare?ids=1,2,3
POST   /api/v1/comparisons
GET    /api/v1/comparisons/{id}

POST   /api/v1/calculators/loan-payment
POST   /api/v1/calculators/interest
POST   /api/v1/calculators/early-payment

POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password

GET    /api/v1/articles
GET    /api/v1/articles/{slug}
GET    /api/v1/faq
```
