# PowerShell script to start all microservices
# Right-click → Run with PowerShell

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "Food Delivery Backend - Local Startup" -ForegroundColor Green
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
Write-Host "Step 1: Starting Docker containers..." -ForegroundColor Cyan
Write-Host ""

Push-Location docker
docker-compose up -d
Pop-Location

Write-Host ""
Write-Host "Waiting 15 seconds for databases to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Verify database containers are running
Write-Host "Verifying database containers..." -ForegroundColor Yellow
$containers = @("auth-db", "catalog-db", "order-db", "payment-db")
foreach ($container in $containers) {
    $status = docker ps --filter "name=$container" --format "{{.State}}"
    if ($status -eq "running") {
        Write-Host "✓ $container is running" -ForegroundColor Green
    }
    else {
        Write-Host "✗ $container is NOT running" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Step 2: Installing dependencies..." -ForegroundColor Cyan
Write-Host ""
npm install

Write-Host ""
Write-Host "Step 3: Starting all microservices..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Running:" -ForegroundColor Yellow
Write-Host "  - API Gateway (Port 3000)" -ForegroundColor White
Write-Host "  - Auth Service (Port 3001)" -ForegroundColor White
Write-Host "  - Catalog Service (Port 3002)" -ForegroundColor White
Write-Host "  - Order Service (Port 3003)" -ForegroundColor White
Write-Host "  - Payment Service (Port 3004)" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""

npm run start:all

Read-Host "Press Enter to exit"
