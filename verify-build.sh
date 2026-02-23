#!/bin/bash

echo "=================================="
echo "Food Delivery Backend - Build Verification"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check TypeScript compilation
echo "Step 1: Checking TypeScript compilation..."
echo ""

# Build common library
echo "Building common library..."
npm run build:common
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Common library build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Common library built successfully${NC}"
echo ""

# Build each service
services=("api-gateway" "auth-service" "catalog-service" "order-service" "payment-service")

for service in "${services[@]}"; do
    echo "Building $service..."
    npm run build -- "$service"
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ $service build failed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ $service built successfully${NC}"
done

echo ""
echo -e "${GREEN}=================================="
echo "All builds completed successfully!"
echo "==================================${NC}"
echo ""
echo "You can now run:"
echo "  npm run docker:build"
echo "  npm run docker:up"
