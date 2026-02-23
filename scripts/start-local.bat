@echo off
echo.
echo ============================================
echo Food Delivery Backend - Local Startup
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
echo Step 1: Starting Docker containers...
echo.
cd docker
call docker-compose up -d
cd ..

echo.
echo Waiting 10 seconds for databases to be ready...
timeout /t 10 /nobreak

echo.
echo Step 2: Installing dependencies...
echo.
call npm install

echo.
echo Step 3: Starting all microservices...
echo.
echo Running:
echo   - API Gateway (Port 3000)
echo   - Auth Service (Port 3001)
echo   - Catalog Service (Port 3002)
echo   - Order Service (Port 3003)
echo   - Payment Service (Port 3004)
echo.
echo Press Ctrl+C to stop all services
echo.
call npm run start:all
pause
