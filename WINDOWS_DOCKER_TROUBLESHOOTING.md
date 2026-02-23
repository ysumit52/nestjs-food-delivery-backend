# Docker Build & Run Troubleshooting Guide

## Windows Docker Specific Issues

### Prerequisites Check
Before running Docker builds, ensure:

```powershell
# Check Docker is running
docker ps

# Check Docker version
docker --version

# Check Docker Compose version
docker-compose --version
```

---

## Step 1: Verify Local Build Works First

**Before building Docker images, test local build:**

### Option A: Windows PowerShell
```powershell
npm install
npm run verify:build
```

### Option B: Windows CMD
```cmd
npm install
npm run verify:build
```

### Option C: Git Bash
```bash
npm install
npm run verify:build
```

This will catch TypeScript errors **before** Docker tries to build.

---

## Common Docker Build Errors & Fixes

### Error: "Cannot find module './dto/create-order.dto'"

**Cause:** Import path is incorrect

**Fix:** Already applied to order.service.ts ✓

**Check:** Run `npm run verify:build` first

---

### Error: "Docker daemon is not running"

**Solution Windows:**
1. Open Docker Desktop application
2. Wait for it to fully start (green status in system tray)
3. Try again

```powershell
# Verify Docker is running
docker ps
```

---

### Error: "Cannot build - permission denied"

**Windows PowerShell Solution:**
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then try again
npm run docker:build
```

---

### Error: "npm: command not found" in Docker

**This means Node.js wasn't installed in build stage**

**Fix:** Already in Dockerfiles ✓

**Verify:**
```bash
cat Dockerfile.api-gateway | grep -A 10 "FROM node"
```

---

## Building Step-by-Step for Windows

### Step 1: Verify Everything Compiles Locally
```powershell
npm install
npm run verify:build
```

If this fails, **stop** - fix the TypeScript errors before Docker

### Step 2: Build Docker Images
```powershell
# Option A: Using npm script
npm run docker:build

# Option B: Build individual images
docker build -f Dockerfile.api-gateway -t food-delivery-api-gateway:latest .
docker build -f Dockerfile.auth-service -t food-delivery-auth-service:latest .
docker build -f Dockerfile.catalog-service -t food-delivery-catalog-service:latest .
docker build -f Dockerfile.order-service -t food-delivery-order-service:latest .
docker build -f Dockerfile.payment-service -t food-delivery-payment-service:latest .

# Option C: Using start-docker script
.\start-docker.bat
```

### Step 3: Verify Images Built
```powershell
docker images | grep food-delivery
```

You should see 5 images:
```
food-delivery-api-gateway       latest     abc123
food-delivery-auth-service      latest     def456
food-delivery-catalog-service   latest     ghi789
food-delivery-order-service     latest     jkl012
food-delivery-payment-service   latest     mno345
```

### Step 4: Start Services
```powershell
npm run docker:up
```

### Step 5: Verify Services Running
```powershell
docker ps
```

All 9 containers should be running:
- 5 microservices
- 4 PostgreSQL databases
- Plus Kafka, Zookeeper, pgAdmin

### Step 6: View Logs
```powershell
npm run docker:logs

# Or specific service
docker logs auth-service -f
```

---

## Build Debugging Tips

### See Full Docker Build Output
```powershell
# Verbose output
docker build -f Dockerfile.api-gateway -t food-delivery-api-gateway:latest --progress=plain .

# Or with BuildKit
$env:DOCKER_BUILDKIT=1
docker build -f Dockerfile.api-gateway -t food-delivery-api-gateway:latest .
```

### Check What's in Docker Image
```powershell
# List files in built image
docker run --rm food-delivery-api-gateway:latest ls -la dist

# Check if app runs
docker run --rm food-delivery-api-gateway:latest node --version
```

### View Layer-by-layer Build
```powershell
# See build history
docker history food-delivery-api-gateway:latest
```

---

## Build Optimization for Windows

### Increase Docker Resources
1. Open Docker Desktop → Settings
2. Go to "Resources"
3. Increase CPU cores (recommended: 4+)
4. Increase Memory (recommended: 4GB+)
5. Click "Apply & Restart"

### Use BuildKit (Faster)
```powershell
$env:DOCKER_BUILDKIT=1
npm run docker:build
```

### Cache Builds
First build takes ~5-10 minutes, subsequent builds are faster due to layer caching.

---

## Network Issues on Windows

### If Services Can't Connect

**1. Check Docker Network**
```powershell
docker network inspect food-delivery-network
```

**2. Restart Docker**
- Windows: Close Docker Desktop, wait 10s, reopen

**3. Rebuild Network**
```powershell
docker-compose -f docker/docker-compose.full.yml down -v
docker-compose -f docker/docker-compose.full.yml up -d
```

---

## Testing After Docker Build

### Health Checks
```powershell
# Windows: Use curl or PowerShell
curl http://localhost:3000
curl http://localhost:3001
curl http://localhost:3002
curl http://localhost:3003
curl http://localhost:3004

# Or use Invoke-WebRequest
Invoke-WebRequest -Uri http://localhost:3000
```

### Database Connection
```powershell
# Check if databases are running
docker ps | findstr "db"

# Test database
docker exec auth-db pg_isready -U postgres
```

### view running services
```powershell
docker-compose -f docker/docker-compose.full.yml ps
```

---

## Quick Reference - Windows Commands

```powershell
# Verify build
npm run verify:build

# Build Docker images
npm run docker:build

# Start all services
npm run docker:up

# View logs
npm run docker:logs

# Restart services
npm run docker:restart

# Stop all services
npm run docker:down

# Clean everything (remove volumes)
npm run docker:clean

# Check status
docker ps
docker-compose -f docker/docker-compose.full.yml ps

# View specific logs
docker logs auth-service -f
docker logs order-service -f
```

---

## If Everything Fails

### Complete Reset
```powershell
# 1. Stop and remove everything
npm run docker:clean

# 2. Clear Docker cache
docker system prune -a -f

# 3. Restart Docker Desktop
# Close Window and reopen

# 4. Rebuild from scratch
npm install
npm run verify:build
npm run docker:build
npm run docker:up
```

---

## Alternative: Run Services Locally (Easier for Development)

If Docker build is giving issues, you can still run services locally:

```powershell
# In Windows PowerShell:

# Terminal 1: Start Docker containers (databases only)
cd docker
docker-compose up -d
cd ..

# Terminal 2: Start services (after 15 seconds)
Start-Sleep -Seconds 15
npm install
npm run start:all
```

This runs services on your machine while databases are in Docker - no need for complex Docker service builds!

---

## Support Files Created

✅ `verify-build.bat` - Windows batch verification script
✅ `verify-build.sh` - Bash verification script
✅ `npm run verify:build` - Quick TypeScript compilation check
✅ All Dockerfiles use multi-stage builds (optimized)
✅ `docker-compose.full.yml` - Complete production setup
