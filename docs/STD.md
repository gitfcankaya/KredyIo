# Software Test Document (STD)
## KredyIo - Credit Comparison Platform

### 1. Introduction

#### 1.1 Purpose
This document describes the testing strategy, test cases, and test procedures for the KredyIo platform.

#### 1.2 Scope
This document covers unit testing, integration testing, and end-to-end testing.

### 2. Testing Strategy

#### 2.1 Test Levels
1. **Unit Tests:** Test individual components/functions
2. **Integration Tests:** Test component interactions
3. **API Tests:** Test API endpoints
4. **E2E Tests:** Test complete user workflows
5. **Performance Tests:** Test system under load
6. **Security Tests:** Test security measures

#### 2.2 Testing Tools

##### Frontend Testing
- **Jest:** Unit testing framework
- **React Testing Library:** Component testing
- **Cypress:** E2E testing
- **MSW (Mock Service Worker):** API mocking

##### Backend Testing
- **xUnit:** Unit testing framework
- **Moq:** Mocking framework
- **FluentAssertions:** Assertion library
- **WebApplicationFactory:** Integration testing
- **Postman/Newman:** API testing

#### 2.3 Test Coverage Goals
- Unit tests: 80%+ code coverage
- Integration tests: Critical paths covered
- E2E tests: Key user workflows covered

### 3. Unit Test Cases

#### 3.1 Frontend Unit Tests

##### 3.1.1 Calculator Components

**Test Suite: LoanCalculator**
```javascript
describe('LoanCalculator', () => {
  test('calculates monthly payment correctly', () => {
    // Arrange
    const amount = 50000;
    const rate = 1.5;
    const term = 36;
    
    // Act
    const result = calculateMonthlyPayment(amount, rate, term);
    
    // Assert
    expect(result).toBeCloseTo(1453.32, 2);
  });

  test('handles zero interest rate', () => {
    const amount = 50000;
    const rate = 0;
    const term = 36;
    
    const result = calculateMonthlyPayment(amount, rate, term);
    
    expect(result).toBeCloseTo(1388.89, 2);
  });

  test('validates input parameters', () => {
    expect(() => calculateMonthlyPayment(-1000, 1.5, 36))
      .toThrow('Amount must be positive');
    
    expect(() => calculateMonthlyPayment(50000, -1, 36))
      .toThrow('Interest rate cannot be negative');
    
    expect(() => calculateMonthlyPayment(50000, 1.5, 0))
      .toThrow('Term must be at least 1 month');
  });
});
```

**Test Suite: InterestCalculator**
```javascript
describe('InterestCalculator', () => {
  test('calculates simple interest correctly', () => {
    const principal = 10000;
    const rate = 5;
    const time = 2;
    
    const result = calculateSimpleInterest(principal, rate, time);
    
    expect(result).toBe(1000);
  });

  test('calculates compound interest correctly', () => {
    const principal = 10000;
    const rate = 5;
    const time = 2;
    const frequency = 12; // monthly
    
    const result = calculateCompoundInterest(principal, rate, time, frequency);
    
    expect(result).toBeCloseTo(1051.16, 2);
  });
});
```

##### 3.1.2 Product Filter Component

**Test Suite: ProductFilter**
```javascript
describe('ProductFilter', () => {
  test('renders all filter options', () => {
    render(<ProductFilter onFilterChange={jest.fn()} />);
    
    expect(screen.getByLabelText('Product Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Interest Rate')).toBeInTheDocument();
    expect(screen.getByLabelText('Loan Amount')).toBeInTheDocument();
  });

  test('calls onFilterChange when filter is applied', () => {
    const mockOnFilterChange = jest.fn();
    render(<ProductFilter onFilterChange={mockOnFilterChange} />);
    
    fireEvent.change(screen.getByLabelText('Product Type'), {
      target: { value: 'PersonalLoan' }
    });
    
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      type: 'PersonalLoan'
    });
  });
});
```

##### 3.1.3 Comparison Table Component

**Test Suite: ComparisonTable**
```javascript
describe('ComparisonTable', () => {
  const mockProducts = [
    { id: '1', productName: 'Loan A', interestRate: 1.5 },
    { id: '2', productName: 'Loan B', interestRate: 1.8 }
  ];

  test('renders product comparison correctly', () => {
    render(<ComparisonTable products={mockProducts} />);
    
    expect(screen.getByText('Loan A')).toBeInTheDocument();
    expect(screen.getByText('Loan B')).toBeInTheDocument();
    expect(screen.getByText('1.5%')).toBeInTheDocument();
    expect(screen.getByText('1.8%')).toBeInTheDocument();
  });

  test('highlights best rate', () => {
    render(<ComparisonTable products={mockProducts} />);
    
    const bestRateCell = screen.getByText('1.5%').parentElement;
    expect(bestRateCell).toHaveClass('best-rate');
  });

  test('handles empty product list', () => {
    render(<ComparisonTable products={[]} />);
    
    expect(screen.getByText('No products to compare')).toBeInTheDocument();
  });
});
```

#### 3.2 Backend Unit Tests

##### 3.2.1 Calculator Service

**Test Class: CalculatorServiceTests**
```csharp
public class CalculatorServiceTests
{
    private readonly ICalculatorService _calculatorService;

    public CalculatorServiceTests()
    {
        _calculatorService = new CalculatorService();
    }

    [Fact]
    public void CalculateLoanPayment_ValidInput_ReturnsCorrectResult()
    {
        // Arrange
        var request = new LoanPaymentRequest
        {
            Amount = 50000,
            InterestRate = 1.5m,
            TermMonths = 36
        };

        // Act
        var result = _calculatorService.CalculateLoanPayment(request);

        // Assert
        result.MonthlyPayment.Should().BeApproximately(1453.32m, 0.01m);
        result.TotalInterest.Should().BeApproximately(2319.52m, 0.01m);
        result.TotalAmount.Should().BeApproximately(52319.52m, 0.01m);
    }

    [Fact]
    public void CalculateLoanPayment_ZeroInterestRate_ReturnsCorrectResult()
    {
        // Arrange
        var request = new LoanPaymentRequest
        {
            Amount = 50000,
            InterestRate = 0,
            TermMonths = 36
        };

        // Act
        var result = _calculatorService.CalculateLoanPayment(request);

        // Assert
        result.MonthlyPayment.Should().BeApproximately(1388.89m, 0.01m);
        result.TotalInterest.Should().Be(0);
    }

    [Theory]
    [InlineData(-1000, 1.5, 36)]
    [InlineData(50000, -1, 36)]
    [InlineData(50000, 1.5, 0)]
    public void CalculateLoanPayment_InvalidInput_ThrowsException(
        decimal amount, decimal rate, int term)
    {
        // Arrange
        var request = new LoanPaymentRequest
        {
            Amount = amount,
            InterestRate = rate,
            TermMonths = term
        };

        // Act & Assert
        Assert.Throws<ArgumentException>(() => 
            _calculatorService.CalculateLoanPayment(request));
    }

    [Fact]
    public void CalculateEarlyPayment_ValidInput_ReturnsCorrectSavings()
    {
        // Arrange
        var request = new EarlyPaymentRequest
        {
            CurrentBalance = 40000,
            InterestRate = 1.5m,
            RemainingTermMonths = 24,
            ExtraPaymentAmount = 5000
        };

        // Act
        var result = _calculatorService.CalculateEarlyPayment(request);

        // Assert
        result.MonthsSaved.Should().BeGreaterThan(0);
        result.InterestSaved.Should().BeGreaterThan(0);
    }
}
```

##### 3.2.2 Product Service

**Test Class: ProductServiceTests**
```csharp
public class ProductServiceTests
{
    private readonly Mock<IProductRepository> _mockRepository;
    private readonly Mock<IMapper> _mockMapper;
    private readonly IProductService _productService;

    public ProductServiceTests()
    {
        _mockRepository = new Mock<IProductRepository>();
        _mockMapper = new Mock<IMapper>();
        _productService = new ProductService(_mockRepository.Object, _mockMapper.Object);
    }

    [Fact]
    public async Task GetProductsAsync_ReturnsPagedResults()
    {
        // Arrange
        var filter = new ProductFilter { Type = ProductType.PersonalLoan };
        var products = new List<Product>
        {
            new Product { Id = Guid.NewGuid(), ProductName = "Loan A" },
            new Product { Id = Guid.NewGuid(), ProductName = "Loan B" }
        };

        _mockRepository
            .Setup(r => r.GetProductsAsync(It.IsAny<ProductFilter>()))
            .ReturnsAsync((products, 2));

        _mockMapper
            .Setup(m => m.Map<ProductDto>(It.IsAny<Product>()))
            .Returns(new ProductDto());

        // Act
        var result = await _productService.GetProductsAsync(filter);

        // Assert
        result.Items.Should().HaveCount(2);
        result.TotalCount.Should().Be(2);
    }

    [Fact]
    public async Task GetProductByIdAsync_ExistingId_ReturnsProduct()
    {
        // Arrange
        var productId = Guid.NewGuid();
        var product = new Product { Id = productId, ProductName = "Test Loan" };

        _mockRepository
            .Setup(r => r.GetByIdAsync(productId))
            .ReturnsAsync(product);

        _mockMapper
            .Setup(m => m.Map<ProductDto>(product))
            .Returns(new ProductDto { Id = productId });

        // Act
        var result = await _productService.GetProductByIdAsync(productId);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(productId);
    }

    [Fact]
    public async Task GetProductByIdAsync_NonExistingId_ThrowsNotFoundException()
    {
        // Arrange
        var productId = Guid.NewGuid();

        _mockRepository
            .Setup(r => r.GetByIdAsync(productId))
            .ReturnsAsync((Product)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => 
            _productService.GetProductByIdAsync(productId));
    }
}
```

### 4. Integration Test Cases

#### 4.1 API Integration Tests

##### 4.1.1 Products API Tests

**Test Class: ProductsControllerIntegrationTests**
```csharp
public class ProductsControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public ProductsControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetProducts_ReturnsSuccessStatusCode()
    {
        // Act
        var response = await _client.GetAsync("/api/v1/products");

        // Assert
        response.EnsureSuccessStatusCode();
        response.Content.Headers.ContentType.MediaType.Should().Be("application/json");
    }

    [Fact]
    public async Task GetProducts_WithFilter_ReturnsFilteredProducts()
    {
        // Act
        var response = await _client.GetAsync("/api/v1/products?type=PersonalLoan");
        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<ApiResponse<PagedResult<ProductDto>>>(content);

        // Assert
        response.EnsureSuccessStatusCode();
        result.Success.Should().BeTrue();
        result.Data.Items.Should().AllSatisfy(p => 
            p.Type.Should().Be(ProductType.PersonalLoan));
    }

    [Fact]
    public async Task CreateProduct_WithValidData_ReturnsCreatedProduct()
    {
        // Arrange
        var newProduct = new CreateProductDto
        {
            Type = ProductType.PersonalLoan,
            LenderName = "Test Bank",
            ProductName = "Test Loan",
            InterestRate = 1.5m,
            MinAmount = 10000,
            MaxAmount = 100000,
            MinTerm = 12,
            MaxTerm = 60
        };

        var content = new StringContent(
            JsonSerializer.Serialize(newProduct),
            Encoding.UTF8,
            "application/json");

        // Act
        var response = await _client.PostAsync("/api/v1/products", content);
        var responseContent = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<ApiResponse<ProductDto>>(responseContent);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        result.Success.Should().BeTrue();
        result.Data.ProductName.Should().Be("Test Loan");
    }
}
```

##### 4.1.2 Calculators API Tests

**Test Class: CalculatorsControllerIntegrationTests**
```csharp
public class CalculatorsControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public CalculatorsControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task CalculateLoanPayment_ValidRequest_ReturnsCorrectResult()
    {
        // Arrange
        var request = new LoanPaymentRequest
        {
            Amount = 50000,
            InterestRate = 1.5m,
            TermMonths = 36
        };

        var content = new StringContent(
            JsonSerializer.Serialize(request),
            Encoding.UTF8,
            "application/json");

        // Act
        var response = await _client.PostAsync("/api/v1/calculators/loan-payment", content);
        var responseContent = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<ApiResponse<LoanPaymentResult>>(responseContent);

        // Assert
        response.EnsureSuccessStatusCode();
        result.Success.Should().BeTrue();
        result.Data.MonthlyPayment.Should().BeApproximately(1453.32m, 0.01m);
    }
}
```

### 5. End-to-End Test Cases

#### 5.1 User Workflows

##### 5.1.1 Product Comparison Workflow
```javascript
describe('Product Comparison E2E', () => {
  it('allows user to compare products', () => {
    // Navigate to products page
    cy.visit('/products');

    // Select product type filter
    cy.get('[data-testid="product-type-filter"]').select('PersonalLoan');

    // Wait for products to load
    cy.get('[data-testid="product-card"]').should('have.length.greaterThan', 0);

    // Select first 3 products for comparison
    cy.get('[data-testid="product-card"]').eq(0).find('[data-testid="add-to-compare"]').click();
    cy.get('[data-testid="product-card"]').eq(1).find('[data-testid="add-to-compare"]').click();
    cy.get('[data-testid="product-card"]').eq(2).find('[data-testid="add-to-compare"]').click();

    // Navigate to comparison page
    cy.get('[data-testid="compare-button"]').click();

    // Verify comparison table
    cy.url().should('include', '/compare');
    cy.get('[data-testid="comparison-table"]').should('be.visible');
    cy.get('[data-testid="comparison-row"]').should('have.length', 3);

    // Verify best rate is highlighted
    cy.get('[data-testid="best-rate"]').should('exist');
  });
});
```

##### 5.1.2 Loan Calculator Workflow
```javascript
describe('Loan Calculator E2E', () => {
  it('calculates loan payment correctly', () => {
    // Navigate to calculator
    cy.visit('/calculators/loan');

    // Input loan details
    cy.get('[data-testid="loan-amount"]').type('50000');
    cy.get('[data-testid="interest-rate"]').type('1.5');
    cy.get('[data-testid="loan-term"]').type('36');

    // Calculate
    cy.get('[data-testid="calculate-button"]').click();

    // Verify results
    cy.get('[data-testid="monthly-payment"]').should('contain', '1,453.32');
    cy.get('[data-testid="total-interest"]').should('contain', '2,319.52');
    cy.get('[data-testid="total-amount"]').should('contain', '52,319.52');

    // Verify amortization schedule
    cy.get('[data-testid="amortization-schedule"]').should('be.visible');
    cy.get('[data-testid="schedule-row"]').should('have.length', 36);
  });
});
```

### 6. Performance Test Cases

#### 6.1 Load Testing
- Test system with 100 concurrent users
- Test system with 1000 concurrent users
- Test API response times under load
- Test database query performance

#### 6.2 Stress Testing
- Gradually increase load until system breaks
- Identify bottlenecks
- Test recovery after stress

### 7. Security Test Cases

#### 7.1 Authentication Tests
- Test login with valid credentials
- Test login with invalid credentials
- Test JWT token expiration
- Test refresh token functionality

#### 7.2 Authorization Tests
- Test access to admin endpoints without auth
- Test access to admin endpoints with user role
- Test access to admin endpoints with admin role

#### 7.3 Input Validation Tests
- Test SQL injection prevention
- Test XSS prevention
- Test CSRF protection
- Test rate limiting

### 8. Test Execution Plan

#### 8.1 Development Phase
- Run unit tests on every commit
- Run integration tests on pull requests
- Run E2E tests daily

#### 8.2 Pre-Production Phase
- Run full test suite
- Run performance tests
- Run security tests
- Run user acceptance tests

#### 8.3 Production Phase
- Run smoke tests after deployment
- Monitor error rates
- Monitor performance metrics

### 9. Test Metrics

#### 9.1 Key Metrics
- Test coverage percentage
- Number of passing/failing tests
- Test execution time
- Defect density
- Mean time to detect (MTTD)
- Mean time to resolve (MTTR)

#### 9.2 Acceptance Criteria
- All unit tests pass
- All integration tests pass
- E2E tests pass for critical workflows
- Code coverage > 80%
- No critical security vulnerabilities
- Performance meets NFRs
