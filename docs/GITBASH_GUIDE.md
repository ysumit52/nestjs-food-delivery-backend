# Running Food Delivery Backend in Git Bash

## Quick Start

### Option 1: Run Automated Script (Recommended)

```bash
# In Git Bash:
bash start-local.sh
```

This automatically:
- Verifies Docker is running
- Starts all containers
- Waits 15 seconds for databases
- Installs npm dependencies
- Starts all 5 microservices

---

## Option 2: Manual Commands (Step by Step)

### Step 1: Start Docker Containers
```bash
cd docker
docker-compose up -d
cd ..
```

### Step 2: Wait for Databases
```bash
sleep 15
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Build Common Library
```bash
npm run build:common
```

### Step 5: Start All Services
```bash
npm run start:all
```

Alternatively, start individual services in separate terminals:

**Terminal 1 - API Gateway:**
```bash
npm run start:gateway
```

**Terminal 2 - Auth Service:**
```bash
npm run start:auth
```

**Terminal 3 - Catalog Service:**
```bash
npm run start:catalog
```

**Terminal 4 - Order Service:**
```bash
npm run start:order
```

**Terminal 5 - Payment Service:**
```bash
npm run start:payment
```

---

## Git Bash Specific Tips

### 1. Opening Git Bash
- Right-click in folder → **Git Bash Here**
- Or search "Git Bash" in Windows Start menu

### 2. Navigation
```bash
# Go to project directory
cd /d/Sumit/Learning/NodeJS/food-delivery-backend

# List files
ls

# Check Docker status
docker ps
```

### 3. Useful Bash Commands
```bash
# Check service logs
docker logs auth-db

# Stop containers
docker-compose -f docker/docker-compose.yml down

# Remove volumes (clean database)
docker-compose -f docker/docker-compose.yml down -v

# Kill a specific port
lsof -i :3000
kill -9 <PID>
```

### 4. Common Issues in Git Bash

**Issue: `npm: command not found`**
```bash
# Add Node to PATH or use full path
/c/Program\ Files/nodejs/npm run start:all

# Or check Node installation
node --version
npm --version
```

**Issue: Line endings cause script failure**
```bash
# Convert .sh file to Unix line endings
dos2unix start-local.sh
# Or open in VS Code and change to LF
```

**Issue: Docker commands not found**
```bash
# Ensure Docker Desktop is running
# Or use full path if Docker is installed
/c/Program\ Files/Docker/Docker/resources/bin/docker ps
```

---

## Checking Service Status

### View All Containers
```bash
docker ps
```

### View All Networks
```bash
docker network ls
```

### Check Database Connection
```bash
# Connect to auth database
docker exec -it auth-db psql -U postgres -d auth_db -c "SELECT 1"

# If successful, shows: 1
```

### View Service Logs
```bash
# All Docker logs
docker-compose logs -f

# Specific service
docker-compose logs auth-db -f

# Exit with Ctrl+C
```

---

## Stop Services

### Stop All Services
```bash
# Press Ctrl+C in the terminal running npm run start:all

# Or in another terminal:
docker-compose -f docker/docker-compose.yml down
```

### Stop Individual Containers
```bash
docker stop auth-db catalog-db order-db payment-db

# Remove containers
docker-compose -f docker/docker-compose.yml down
```

---

## Troubleshooting

### Services Won't Start
```bash
# 1. Check if Docker is running
docker ps

# 2. Check if ports are in use
netstat -ano | grep 3000

# 3. View Docker logs
docker logs auth-db

# 4. Restart Docker
# Close Docker Desktop and reopen it
```

### Database Connection Errors
```bash
# 1. Ensure containers are running
docker ps

# 2. Check if database is ready
docker logs auth-db | tail -20

# 3. Test connection
docker exec auth-db pg_isready -U postgres

# 4. Wait longer before starting services
sleep 30
```

### npm Install Fails
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or use yarn (if installed)
yarn install
```

---

## Example Full Workflow in Git Bash

```bash
#!/bin/bash

# Navigate to project
cd /d/Sumit/Learning/NodeJS/food-delivery-backend

# Start Docker
cd docker
docker-compose up -d
cd ..

# Wait for databases
echo "Waiting for databases..."
sleep 15

# Install and run
npm install
npm run build:common
npm run start:all
```

---

## Environment Variables in Git Bash

### View all .env variables
```bash
cat apps/auth-service/.env
```

### Set temporary variable
```bash
export DB_HOST=localhost
export DB_PORT=5433
echo $DB_HOST
```

### Check if variable is set
```bash
if [ -z "$DB_PASSWORD" ]; then
    echo "DB_PASSWORD is not set"
else
    echo "DB_PASSWORD is set"
fi
```

---

## Performance Tips

### 1. Use Bash Instead Of PowerShell
Bash is generally faster in Git Bash for these operations.

### 2. Keep Containers Running
```bash
# Don't stop containers between testing
docker-compose -f docker/docker-compose.yml up -d

# Just restart services if needed
npm run start:all
```

### 3. Monitor Resource Usage
```bash
# Check Docker resource usedocker stats

# View memory usage
free -m
```

---

## Using With VS Code Terminal

Git Bash can be your default terminal in VS Code:

1. Open VS Code Settings (Ctrl+,)
2. Search: "terminal default profile"
3. Set to: `Git Bash`

Then use integrated terminal:
```bash
Ctrl+` (backtick)
bash start-local.sh
```

---

## Testing After Startup

Once all services are running:

```bash
# Test Auth Service
curl http://localhost:3001/auth/register

# Test Catalog Service
curl http://localhost:3002/catalog/categories

# Test Order Service
curl http://localhost:3003/orders

# Test Payment Service
curl http://localhost:3004/payments

# Test API Gateway
curl http://localhost:3000
```

All should return data or validation errors (not connection errors).
