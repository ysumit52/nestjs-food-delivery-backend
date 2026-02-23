#!/bin/bash

echo ""
echo "============================================"
echo "Food Delivery Backend - Docker Full Stack"
echo "============================================"
echo ""

# Check if Docker is running
echo "Checking Docker status..."
if ! docker ps > /dev/null 2>&1; then
    echo "✗ ERROR: Docker is not running. Please start Docker Desktop first."
    read -p "Press Enter to exit"
    exit 1
fi
echo "✓ Docker is running"

echo ""
echo "Step 1: Building microservice images..."
echo ""

# Build all images
echo "Building API Gateway..."
docker build -f Dockerfile.api-gateway -t food-delivery-api-gateway:latest .
if [ $? -ne 0 ]; then
    echo "✗ ERROR: Failed to build API Gateway image"
    exit 1
fi

echo "Building Auth Service..."
docker build -f Dockerfile.auth-service -t food-delivery-auth-service:latest .
if [ $? -ne 0 ]; then
    echo "✗ ERROR: Failed to build Auth Service image"
    exit 1
fi

echo "Building Catalog Service..."
docker build -f Dockerfile.catalog-service -t food-delivery-catalog-service:latest .
if [ $? -ne 0 ]; then
    echo "✗ ERROR: Failed to build Catalog Service image"
    exit 1
fi

echo "Building Order Service..."
docker build -f Dockerfile.order-service -t food-delivery-order-service:latest .
if [ $? -ne 0 ]; then
    echo "✗ ERROR: Failed to build Order Service image"
    exit 1
fi

echo "Building Payment Service..."
docker build -f Dockerfile.payment-service -t food-delivery-payment-service:latest .
if [ $? -ne 0 ]; then
    echo "✗ ERROR: Failed to build Payment Service image"
    exit 1
fi

echo ""
echo "Step 2: Starting all services with docker-compose..."
echo ""

cd docker
docker-compose -f docker-compose.full.yml up -d
if [ $? -ne 0 ]; then
    echo "✗ ERROR: Failed to start services"
    exit 1
fi
cd ..

echo ""
echo "Step 3: Waiting for all services to be ready..."
echo ""
sleep 10

echo ""
echo "============================================"
echo "All services are starting..."
echo "============================================"
echo ""
echo "Services:"
echo "  - API Gateway: http://localhost:3000"
echo "  - Auth Service: http://localhost:3001"
echo "  - Catalog Service: http://localhost:3002"
echo "  - Order Service: http://localhost:3003"
echo "  - Payment Service: http://localhost:3004"
echo "  - pgAdmin: http://localhost:5050 (admin@admin.com / admin)"
echo ""
echo "To view logs:"
echo "  docker-compose -f docker/docker-compose.full.yml logs -f"
echo ""
echo "To stop all services:"
echo "  docker-compose -f docker/docker-compose.full.yml down"
echo ""

read -p "Press Enter to continue"
