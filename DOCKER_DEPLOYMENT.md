# Docker Deployment Guide

## Overview

This guide explains how to containerize and run all microservices using Docker. You have two deployment options:

1. **Local Development** - Services run on host machine, databases in Docker
2. **Full Docker** - All services + databases run in Docker containers

---

## Prerequisites

- Docker Desktop installed and running
- Docker Compose installed (comes with Docker Desktop)
- All `.env` files configured

---

## Option 1: Local Development Mode

**Services run on your machine | Databases in Docker**

### Start Only Databases
```bash
cd docker
docker-compose up -d
cd ..
```

### Start Services Locally
```bash
npm install
npm run start:all
```

**Result:**
- Databases: Running in Docker
- Services: Running locally on ports 3000-3004
- Logs: Visible in terminal

---

## Option 2: Full Docker Mode

**Everything runs in containers**

### Quick Start

#### Windows (Batch Script)
```bash
.\start-docker.bat
```

#### Windows (PowerShell)
```powershell
.\start-docker.ps1
```

#### Linux/Mac (Bash)
```bash
bash start-docker.sh
```

---

## Manual Docker Commands

### Build All Images
```bash
npm run docker:build
```

Or build individually:
```bash
docker build -f Dockerfile.api-gateway -t food-delivery-api-gateway:latest .
docker build -f Dockerfile.auth-service -t food-delivery-auth-service:latest .
docker build -f Dockerfile.catalog-service -t food-delivery-catalog-service:latest .
docker build -f Dockerfile.order-service -t food-delivery-order-service:latest .
docker build -f Dockerfile.payment-service -t food-delivery-payment-service:latest .
```

### Start All Services
```bash
npm run docker:up
```

Or manually:
```bash
docker-compose -f docker/docker-compose.full.yml up -d
```

### View Logs
```bash
npm run docker:logs
```

### Stop All Services
```bash
npm run docker:down
```

### Restart Services
```bash
npm run docker:restart
```

### Clean Everything (Remove Volumes)
```bash
npm run docker:clean
```

---

## Service URLs

Once running, access services at:

| Service | URL | Health Check |
|---------|-----|--------------|
| API Gateway | http://localhost:3000 | curl -s http://localhost:3000 |
| Auth Service | http://localhost:3001 | curl -s http://localhost:3001 |
| Catalog Service | http://localhost:3002 | curl -s http://localhost:3002 |
| Order Service | http://localhost:3003 | curl -s http://localhost:3003 |
| Payment Service | http://localhost:3004 | curl -s http://localhost:3004 |
| pgAdmin | http://localhost:5050 | **admin@admin.com / admin** |
| Kafka | localhost:9092 | - |
| Zookeeper | localhost:2181 | - |

---

## Docker Compose Files

### `docker/docker-compose.yml` (Databases Only)
Used for local development. Contains:
- PostgreSQL databases (4)
- Kafka + Zookeeper
- pgAdmin

```bash
docker-compose up -d
```

### `docker/docker-compose.full.yml` (Full Stack)
Used for complete Docker deployment. Contains:
- PostgreSQL databases (4)
- Kafka + Zookeeper
- pgAdmin
- All 5 microservices

```bash
docker-compose -f docker-compose.full.yml up -d
```

---

## Testing Deployed Services

### Health Checks
```bash
# Check if services are running
docker ps

# View container status
docker-compose -f docker/docker-compose.full.yml ps

# Check service health
curl http://localhost:3000
curl http://localhost:3001
curl http://localhost:3002
curl http://localhost:3003
curl http://localhost:3004
```

### View Logs
```bash
# All logs
docker-compose -f docker/docker-compose.full.yml logs -f

# Specific service
docker-compose -f docker/docker-compose.full.yml logs -f auth-service

# Last 50 lines
docker-compose -f docker/docker-compose.full.yml logs --tail=50 auth-service
```

### Access Running Container
```bash
docker exec -it auth-service /bin/sh
docker exec -it auth-db psql -U postgres -d auth_db
```

---

## Dockerfile Structure

Each service has a multi-stage Dockerfile:

1. **Builder Stage**
   - Installs all dependencies
   - Builds the project
   - Compiles TypeScript

2. **Production Stage**
   - Uses minimal Alpine Linux
   - Installs only production dependencies
   - Copies built artifacts
   - Runs the application

**Benefits:**
- Smaller image size (~300MB → ~150MB)
- Faster deployment
- Secure (no source code in production image)

---

## Environment Configuration

### Docker vs Local

**Local Development (.env files):**
```
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

**Docker Environment (docker-compose.full.yml):**
```yaml
environment:
  DB_HOST: auth-db          # Docker service name
  DB_PORT: 5432             # Internal port
  DB_USERNAME: postgres
  DB_PASSWORD: postgres
```

Services communicate using Docker network names instead of localhost.

---

## Networking

### Docker Network
All containers communicate via bridge network: `food-delivery-network`

```bash
# List networks
docker network ls

# Inspect network
docker network inspect food-delivery-network
```

### Service Discovery
- **Service name** = hostname inside Docker network
- `auth-service` → reachable as `auth-service:3001`
- `auth-db` → reachable as `auth-db:5432`

---

## Health Checks

Each service has healthchecks configured:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000"]
  interval: 10s
  timeout: 5s
  retries: 5
```

**Status:**
```bash
docker ps --format "table {{.Names}}\t{{.Status}}"
```

---

## Troubleshooting Docker

### Services Won't Start
```bash
# Check error logs
docker-compose -f docker/docker-compose.full.yml logs auth-service

# Verify image exists
docker images | grep food-delivery

# Rebuild image
docker build --no-cache -f Dockerfile.auth-service -t food-delivery-auth-service:latest .
```

### Database Connection Failed
```bash
# Check if database container is running
docker ps | grep auth-db

# Test database connection
docker exec auth-db pg_isready -U postgres

# View database logs
docker logs auth-db
```

### Port Already in Use
```bash
# Find process using port
netstat -ano | grep 3000  (Windows)
lsof -i :3000             (Mac/Linux)

# Kill process
taskkill /PID <PID> /F

# Or change port in docker-compose.full.yml
```

### Docker Daemon Issues
```bash
# Restart Docker
# Windows: Restart Docker Desktop
# Linux: sudo systemctl restart docker

# Verify Docker is running
docker ps
```

### Out of Disk Space
```bash
# Clean up unused images, containers, volumes
docker system prune -a

# View disk usage
docker system df
```

---

## Performance Tuning

### Docker Desktop Resources
1. Settings → Resources
2. Increase CPU cores (recommended: 4+)
3. Increase memory (recommended: 4GB+)

### View Resource Usage
```bash
# Real-time stats
docker stats

# Specific container
docker stats auth-service
```

### Optimize Image Size
```bash
# View layer sizes
docker history food-delivery-auth-service:latest

# Build with buildkit (faster)
DOCKER_BUILDKIT=1 docker build -f Dockerfile.auth-service -t food-delivery-auth-service:latest .
```

---

## Production Considerations

### For Production, Consider:

1. **Use Docker Registry**
   ```bash
   docker tag food-delivery-auth-service:latest myregistry.azurecr.io/auth-service:v1.0.0
   docker push myregistry.azurecr.io/auth-service:v1.0.0
   ```

2. **Enable Restart Policies**
   ```yaml
   restart: always
   ```

3. **Resource Limits**
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '1'
         memory: 512M
   ```

4. **Logging Driver**
   ```yaml
   logging:
     driver: "json-file"
     options:
       max-size: "10m"
       max-file: "3"
   ```

5. **Use Secrets**
   ```bash
   docker secret create db_password ./db_password.txt
   ```

6. **Orchestration**
   - Use Kubernetes (K8s) or Docker Swarm
   - Service mesh (Istio, Linkerd)

---

## Quick Reference

```bash
# Development
npm run start:all                    # Run locally

# Docker Full Stack
npm run docker:build                 # Build all images
npm run docker:up                    # Start all services
npm run docker:logs                  # View logs
npm run docker:restart               # Restart services
npm run docker:down                  # Stop services
npm run docker:clean                 # Remove all volumes

# Manual Docker
docker-compose -f docker/docker-compose.full.yml up -d
docker-compose -f docker/docker-compose.full.yml down
docker-compose -f docker/docker-compose.full.yml logs -f
```

---

## Next Steps

1. ✅ Build images: `npm run docker:build`
2. ✅ Start services: `npm run docker:up`
3. ✅ View logs: `npm run docker:logs`
4. ✅ Test endpoints with Postman
5. ✅ Monitor with `docker stats`
6. ✅ Stop services: `npm run docker:down`
