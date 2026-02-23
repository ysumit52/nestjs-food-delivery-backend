# PowerShell script to start all microservices in Docker
# Right-click → Run with PowerShell

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "Food Delivery Backend - Docker Full Stack" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker status..." -ForegroundColor Yellow
try {
    docker ps > $null 2>&1
    Write-Host "✓ Docker is running" -ForegroundColor Green
}
catch {
    Write-Host "✗ ERROR: Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 1: Building microservice images..." -ForegroundColor Cyan
Write-Host ""

# Build all images
$images = @(
    @{ name = "API Gateway"; dockerfile = "Dockerfile.api-gateway"; tag = "food-delivery-api-gateway:latest" },
    @{ name = "Auth Service"; dockerfile = "Dockerfile.auth-service"; tag = "food-delivery-auth-service:latest" },
    @{ name = "Catalog Service"; dockerfile = "Dockerfile.catalog-service"; tag = "food-delivery-catalog-service:latest" },
    @{ name = "Order Service"; dockerfile = "Dockerfile.order-service"; tag = "food-delivery-order-service:latest" },
    @{ name = "Payment Service"; dockerfile = "Dockerfile.payment-service"; tag = "food-delivery-payment-service:latest" }
)

foreach ($image in $images) {
    Write-Host "Building $($image.name)..." -ForegroundColor Yellow
    docker build -f $image.dockerfile -t $image.tag .
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ ERROR: Failed to build $($image.name) image" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ $($image.name) built successfully" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 2: Starting all services with docker-compose..." -ForegroundColor Cyan
Write-Host ""

Push-Location docker
docker-compose -f docker-compose.full.yml up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ ERROR: Failed to start services" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

Write-Host ""
Write-Host "Step 3: Waiting for all services to be ready..." -ForegroundColor Yellow
Write-Host ""
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "All services are starting..." -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Services:" -ForegroundColor Yellow
Write-Host "  - API Gateway: http://localhost:3000" -ForegroundColor White
Write-Host "  - Auth Service: http://localhost:3001" -ForegroundColor White
Write-Host "  - Catalog Service: http://localhost:3002" -ForegroundColor White
Write-Host "  - Order Service: http://localhost:3003" -ForegroundColor White
Write-Host "  - Payment Service: http://localhost:3004" -ForegroundColor White
Write-Host "  - pgAdmin: http://localhost:5050 (admin@admin.com / admin)" -ForegroundColor White
Write-Host ""
Write-Host "To view logs:" -ForegroundColor Cyan
Write-Host "  docker-compose -f docker/docker-compose.full.yml logs -f" -ForegroundColor White
Write-Host ""
Write-Host "To stop all services:" -ForegroundColor Cyan
Write-Host "  docker-compose -f docker/docker-compose.full.yml down" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"
