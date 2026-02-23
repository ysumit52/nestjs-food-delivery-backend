# Windows Docker Quick Start Guide

## Prerequisites
- Docker Desktop installed and running
- Project built locally: `npm run verify:build`

---

## Complete Windows Startup Sequence

### Step 1: Start Docker Desktop
- Click Windows Start menu
- Type "Docker" and click "Docker Desktop"
- Wait for Docker icon in system tray to show green (fully loaded)

**Verify Docker is running:**
```powershell
docker ps
```

Should show (not error):
```
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

---

### Step 2: Verify Local Build
```powershell
npm install
npm run verify:build
```

If this fails, fix the errors first before proceeding.

---

### Step 3: Build Docker Images
```powershell
npm run docker:build
```

This will build all 5 microservice images (takes 5-15 minutes first time).

**Verify images built:**
```powershell
docker images | findstr "food-delivery"
```

Should show:
```
food-delivery-api-gateway          latest
food-delivery-auth-service         latest
food-delivery-catalog-service      latest
food-delivery-order-service        latest
food-delivery-payment-service      latest
```

---

### Step 4: Start All Services
```powershell
npm run docker:up
```

**Verify all containers are running:**
```powershell
docker ps
```

Should show 9 running containers:
- auth-service
- catalog-service
- order-service
- payment-service
- api-gateway
- auth-db
- catalog-db
- order-db
- payment-db
- Plus: kafka, zookeeper, pgadmin

---

### Step 5: View Logs
```powershell
npm run docker:logs
```

Press `Ctrl+C` to exit logs.

---

## Quick Commands Reference

```powershell
# Verify build locally
npm run verify:build

# Build all Docker images
npm run docker:build

# Start all services
npm run docker:up

# View logs
npm run docker:logs

# Restart services
npm run docker:restart

# Stop all services
npm run docker:down

# Clean/remove everything
npm run docker:clean

# Check Docker status
docker ps

# Check specific service logs
docker logs auth-service -f
docker logs order-service -f

# Check image sizes
docker images | findstr "food-delivery"
```

---

## Testing Services

Once running, test endpoints:

```powershell
# Test API Gateway
curl http://localhost:3000

# Test Auth Service
curl http://localhost:3001

# Test Catalog Service
curl http://localhost:3002

# Test Order Service
curl http://localhost:3003

# Test Payment Service
curl http://localhost:3004

# Or use Invoke-WebRequest
Invoke-WebRequest -Uri http://localhost:3000
```

---

## If Services Don't Start

### Check Docker Resource Limits
1. Right-click Docker icon → Settings
2. Resources → Increase CPU and Memory
3. Apply & Restart Docker

### Restart Everything
```powershell
# Stop all
npm run docker:down

# Wait 10 seconds
Start-Sleep -Seconds 10

# Clean volumes
npm run docker:clean

# Restart Docker Desktop
# Close and reopen Docker app

# Start fresh
npm run docker:up
```

### View Specific Service Logs
```powershell
docker logs auth-service
docker logs order-service
docker-compose -f docker/docker-compose.full.yml ps
```

---

## Alternative: Run Services Locally (Easier)

If Docker is giving issues, use this simpler setup:

```powershell
# Terminal 1: Start databases only
cd docker
docker-compose up -d
cd ..
Start-Sleep -Seconds 15

# Terminal 2: Start services locally
npm install
npm run start:all
```

Services will run on ports 3000-3004 with live reload!

---

## Clean Up & Stop

```powershell
# Stop services
npm run docker:down

# Remove everything including volumes
npm run docker:clean

# Or manually
docker-compose -f docker/docker-compose.full.yml down -v
```

---

## Access GUI Tools

Once running:

- **pgAdmin** (Database UI): http://localhost:5050
  - Email: admin@admin.com
  - Password: admin

- **Postman** (API Testing): Import `postman-collection.json`
