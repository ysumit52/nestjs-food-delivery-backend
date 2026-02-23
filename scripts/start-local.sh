#!/bin/bash

echo ""
echo "============================================"
echo "Food Delivery Backend - Local Startup"
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
echo "Step 1: Starting Docker containers..."
echo ""
cd docker
docker-compose up -d
cd ..

echo ""
echo "Waiting 15 seconds for databases to be ready..."
sleep 15

# Verify database containers are running
echo "Verifying database containers..."
containers=("auth-db" "catalog-db" "order-db" "payment-db")
for container in "${containers[@]}"; do
    status=$(docker ps --filter "name=$container" --format "{{.State}}")
    if [ "$status" = "running" ]; then
        echo "✓ $container is running"
    else
        echo "✗ $container is NOT running"
    fi
done

echo ""
echo "Step 2: Installing dependencies..."
echo ""
npm install

echo ""
echo "Step 3: Starting all microservices..."
echo ""
echo "Running:"
echo "  - API Gateway (Port 3000)"
echo "  - Auth Service (Port 3001)"
echo "  - Catalog Service (Port 3002)"
echo "  - Order Service (Port 3003)"
echo "  - Payment Service (Port 3004)"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

npm run start:all

read -p "Press Enter to exit"
