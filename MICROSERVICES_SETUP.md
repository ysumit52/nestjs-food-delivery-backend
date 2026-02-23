# Microservices Local Setup Guide

## Quick Start (Single Command)

On Windows, simply run:
```bash
.\start-local.bat
```

This will automatically:
1. Start Docker containers (PostgreSQL, Kafka, Zookeeper)
2. Install dependencies
3. Run all 5 services in parallel

## Manual Setup (Step by Step)

### Step 1: Start Infrastructure
```bash
cd docker
docker-compose up -d
cd ..
```

Wait for containers to be ready. Check with:
```bash
docker ps
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start All Services (Single Terminal)
```bash
npm run start:all
```

This runs all 5 services in one terminal with color-coded output:
- **Auth Service** → http://localhost:3001
- **Catalog Service** → http://localhost:3002
- **Order Service** → http://localhost:3003
- **Payment Service** → http://localhost:3004
- **API Gateway** → http://localhost:3000

### Alternative: Run Services Individually
If you want to run/debug specific services:

```bash
npm run start:auth       # Terminal 1
npm run start:catalog    # Terminal 2
npm run start:order      # Terminal 3
npm run start:payment    # Terminal 4
npm run start:gateway    # Terminal 5
```

## Verify Services Are Running

Check logs for messages like:
```
Auth Service is running on: http://localhost:3001
Catalog Service is running on: http://localhost:3002
Order Service is running on: http://localhost:3003
Payment Service is running on: http://localhost:3004
```

## Stop Services

- **All services**: Press `Ctrl+C` in the terminal
- **Docker containers**: `docker-compose -f docker down`

## Database Access

**pgAdmin Interface**: http://localhost:5050
- Email: `admin@admin.com`
- Password: `admin`

## Troubleshooting

### Port Already in Use
If a port is already in use, update the port in the `.env` file of the service:
- Auth: `apps/auth-service/.env` → `PORT=3001`
- Catalog: `apps/catalog-service/.env` → `PORT=3002`
- Order: `apps/order-service/.env` → `PORT=3003`
- Payment: `apps/payment-service/.env` → `PORT=3004`

### Database Connection Issues
Verify Docker containers are running:
```bash
docker ps
```

Check environment variables match the docker-compose ports:
```
DB_PORT=5433  # Auth
DB_PORT=5434  # Catalog
DB_PORT=5435  # Order
DB_PORT=5436  # Payment
```

### Missing Dependencies
Reinstall clean:
```bash
npm install
npm run build:common
```
