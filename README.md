# KredyIo - Credit Comparison Platform

A comprehensive credit information, calculation, and comparison platform built with .NET Core and React.

## Features

- **Product Comparison**: Compare up to 5 credit products side-by-side
- **Smart Filters**: Filter by product type, interest rate, amount, and more
- **Loan Calculator**: Calculate monthly payments with detailed amortization schedule
- **Interest Calculator**: Compare simple and compound interest
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Modern Tech Stack**: .NET Core 9.0 backend, React with TypeScript frontend

## Tech Stack

### Backend
- .NET Core 9.0
- ASP.NET Core Web API
- Entity Framework Core
- In-Memory Database (for development)
- Serilog for logging
- JWT Authentication
- AutoMapper

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Axios
- React Router

## Getting Started

### Prerequisites
- .NET SDK 9.0 or later
- Node.js 18 or later
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend/KredyIo.API
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Run the application:
```bash
dotnet run
```

The API will start at `http://localhost:5000` (or as configured in launchSettings.json).

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`.

## Project Structure

```
KredyIo/
├── backend/
│   └── KredyIo.API/
│       ├── Controllers/          # API controllers
│       ├── Services/             # Business logic
│       ├── Models/
│       │   ├── Entities/        # Database entities
│       │   └── DTOs/            # Data transfer objects
│       ├── Data/                # Database context
│       └── Program.cs           # Application entry point
├── frontend/
│   └── src/
│       ├── components/          # React components
│       ├── services/            # API services
│       ├── types/               # TypeScript types
│       └── App.tsx              # Main application
└── docs/
    ├── PRD.md                   # Product Requirements
    ├── SRS.md                   # Software Requirements
    ├── SDD.md                   # Software Design
    ├── STD.md                   # Software Testing
    └── TODO.md                  # Implementation TODO list
```

## API Endpoints

### Products
- `GET /api/v1/products` - Get all products with filters
- `GET /api/v1/products/{id}` - Get product by ID
- `GET /api/v1/products/compare?ids=1,2,3` - Compare products

### Calculators
- `POST /api/v1/calculators/loan-payment` - Calculate loan payment
- `POST /api/v1/calculators/interest` - Calculate interest
- `POST /api/v1/calculators/early-payment` - Calculate early payment savings

## Sample Products

The application comes with 5 pre-seeded products:
1. Türkiye İş Bankası - İhtiyaç Kredisi (1.89%)
2. Garanti BBVA - Garantili İhtiyaç Kredisi (1.95%)
3. Akbank - Axess Kredi Kartı (2.50%)
4. Yapı Kredi - Konut Kredisi (1.25%)
5. QNB Finansbank - Taşıt Kredisi (1.69%)

## Development

### Running Tests

Backend:
```bash
cd backend/KredyIo.API
dotnet test
```

Frontend:
```bash
cd frontend
npm test
```

### Building for Production

Backend:
```bash
cd backend/KredyIo.API
dotnet publish -c Release
```

Frontend:
```bash
cd frontend
npm run build
```

## Deployment

### Frontend (Vercel)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd frontend
vercel
```

### Backend

The backend can be deployed to:
- Azure App Service
- AWS Elastic Beanstalk
- Docker containers
- Any hosting service supporting .NET Core

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

### Backend (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "your-connection-string"
  }
}
```

## Features Roadmap

- [x] Product listing and filtering
- [x] Loan calculator with amortization schedule
- [x] Interest calculator
- [x] Product comparison (up to 5 products)
- [ ] User authentication and profiles
- [ ] Save favorite products
- [ ] Rate change notifications
- [ ] Multi-language support
- [ ] Mobile apps (iOS/Android)
- [ ] Advanced analytics dashboard

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact: info@kredyio.com

## Documentation

For detailed documentation, see:
- [Product Requirements Document (PRD)](docs/PRD.md)
- [Software Requirements Specification (SRS)](docs/SRS.md)
- [Software Design Document (SDD)](docs/SDD.md)
- [Software Test Document (STD)](docs/STD.md)
- [TODO List](docs/TODO.md)