@echo off
echo.
echo ============================================
echo Food Delivery Backend - Docker Full Stack
echo ============================================
echo.

REM Check if Docker is running
echo Checking Docker status...
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

echo.
echo Step 1: Building microservice images...
echo.
docker build -f Dockerfile.api-gateway -t food-delivery-api-gateway:latest .
if %errorlevel% neq 0 (
    echo ERROR: Failed to build API Gateway image
    pause
    exit /b 1
)

docker build -f Dockerfile.auth-service -t food-delivery-auth-service:latest .
if %errorlevel% neq 0 (
    echo ERROR: Failed to build Auth Service image
    pause
    exit /b 1
)

docker build -f Dockerfile.catalog-service -t food-delivery-catalog-service:latest .
if %errorlevel% neq 0 (
    echo ERROR: Failed to build Catalog Service image
    pause
    exit /b 1
)

docker build -f Dockerfile.order-service -t food-delivery-order-service:latest .
if %errorlevel% neq 0 (
    echo ERROR: Failed to build Order Service image
    pause
    exit /b 1
)

docker build -f Dockerfile.payment-service -t food-delivery-payment-service:latest .
if %errorlevel% neq 0 (
    echo ERROR: Failed to build Payment Service image
    pause
    exit /b 1
)

echo.
echo Step 2: Starting all services with docker-compose...
echo.
cd docker
docker-compose -f docker-compose.full.yml up -d
cd ..

if %errorlevel% neq 0 (
    echo ERROR: Failed to start services
    pause
    exit /b 1
)

echo.
echo Step 3: Waiting for all services to be ready...
echo.
timeout /t 10 /nobreak

echo.
echo ============================================
echo All services are starting...
echo ============================================
echo.
echo Services:
echo   - API Gateway: http://localhost:3000
echo   - Auth Service: http://localhost:3001
echo   - Catalog Service: http://localhost:3002
echo   - Order Service: http://localhost:3003
echo   - Payment Service: http://localhost:3004
echo   - pgAdmin: http://localhost:5050 (admin@admin.com / admin)
echo.
echo To view logs:
echo   docker-compose -f docker/docker-compose.full.yml logs -f
echo.
echo To stop all services:
echo   docker-compose -f docker/docker-compose.full.yml down
echo.
pause
