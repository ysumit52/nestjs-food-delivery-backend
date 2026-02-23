@echo off
echo.
echo ==================================
echo Food Delivery Backend - Build Verification
echo ==================================
echo.

REM Check TypeScript compilation
echo Step 1: Checking TypeScript compilation...
echo.

REM Build common library
echo Building common library...
call npm run build:common
if %errorlevel% neq 0 (
    echo [ERROR] Common library build failed
    pause
    exit /b 1
)
echo [OK] Common library built successfully
echo.

REM Build each service
for %%S in (api-gateway auth-service catalog-service order-service payment-service) do (
    echo Building %%S...
    call npm run build -- %%S
    if !errorlevel! neq 0 (
        echo [ERROR] %%S build failed
        pause
        exit /b 1
    )
    echo [OK] %%S built successfully
)

echo.
echo ==================================
echo All builds completed successfully!
echo ==================================
echo.
echo You can now run:
echo   npm run docker:build
echo   npm run docker:up
echo.
pause
