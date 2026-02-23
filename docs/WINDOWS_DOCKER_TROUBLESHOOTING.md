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

## Building Step-by-Step for Windows

### Step 1: Verify Everything Compiles Locally
```powershell
npm install
npm run verify:build
```

### Step 2: Build Docker Images
```powershell
npm run docker:build
```

### Step 3: Verify Images Built
```powershell
docker images | findstr "food-delivery"
```

### Step 4: Start Services
```powershell
npm run docker:up
```

### Step 5: Verify Services Running
```powershell
docker ps
```

### Step 6: View Logs
```powershell
npm run docker:logs
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

---

## Build Optimization for Windows

### Increase Docker Resources
1. Open Docker Desktop → Settings
2. Go to "Resources"
3. Increase CPU cores (recommended: 4+)
4. Increase Memory (recommended: 4GB+)
5. Click "Apply & Restart"

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
curl http://localhost:3000
curl http://localhost:3001
curl http://localhost:3002
curl http://localhost:3003
curl http://localhost:3004
```

### Database Connection
```powershell
docker exec auth-db pg_isready -U postgres
```

---

## Quick Reference - Windows Commands

```powershell
npm run verify:build
npm run docker:build
npm run docker:up
npm run docker:logs
npm run docker:restart
npm run docker:down
npm run docker:clean
```

---

## Alternative: Run Services Locally (Easier for Development)

```powershell
# Terminal 1: Start Docker containers (databases only)
cd docker
docker-compose up -d
cd ..

# Terminal 2: Start services (after 15 seconds)
Start-Sleep -Seconds 15
npm install
npm run start:all
```

---

## Support Files Created

✅ `verify-build.bat` - Windows batch verification script
✅ `verify-build.sh` - Bash verification script
✅ `npm run verify:build` - Quick TypeScript compilation check
✅ All Dockerfiles use multi-stage builds (optimized)
✅ `docker-compose.full.yml` - Complete production setup
