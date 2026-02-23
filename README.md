# Food Delivery Backend - Microservices Architecture

A production-ready food delivery backend system built with NestJS, PostgreSQL, Kafka, and Docker. Features JWT authentication, microservices architecture, and type-safe API validation with Zod.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        API Gateway                           │
│                    (Port: 3000)                             │
│           - JWT Authentication & Authorization               │
│           - Request Routing & Aggregation                    │
└─────────────────┬───────────────────────────────────────────┘
                  │
        ┌─────────┼─────────┬─────────┬─────────┐
        │         │         │         │         │
┌───────▼───┐ ┌──▼──────┐ ┌▼────────┐ ┌▼────────┐
│   Auth    │ │ Catalog │ │  Order  │ │ Payment │
│  Service  │ │ Service │ │ Service │ │ Service │
│ (3001)    │ │ (3002)  │ │ (3003)  │ │ (3004)  │
└─────┬─────┘ └────┬────┘ └────┬────┘ └────┬────┘
      │            │           │           │
┌─────▼─────┐ ┌───▼──────┐ ┌──▼─────┐ ┌────▼──────┐
│ auth_db   │ │catalog_db│ │order_db│ │payment_db │
│ (5433)    │ │  (5434)  │ │ (5435) │ │   (5436)  │
└───────────┘ └──────────┘ └────────┘ └───────────┘
                                      
```

## 🚀 Tech Stack

- **Framework**: NestJS (TypeScript)
- **Databases**: PostgreSQL (one per service)
- **Message Queue**: Apache Kafka + Zookeeper
- **Validation**: Zod
- **Authentication**: JWT (passport-jwt)
- **ORM**: TypeORM
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Docker Desktop**: Latest version
- **Git**: Latest version

Check versions:
```bash
node --version
npm --version
docker --version
git --version
```

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd food-delivery-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create `.env` files for each service:

#### **apps/auth-service/.env**
```env
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=auth_db

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

KAFKA_BROKER=localhost:9092
PORT=3001
```

#### **apps/catalog-service/.env**
```env
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=catalog_db

PORT=3002
KAFKA_BROKER=localhost:9092
```

#### **apps/order-service/.env**
```env
DB_HOST=localhost
DB_PORT=5434
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=order_db

PORT=3003
KAFKA_BROKER=localhost:9092
```

#### **apps/payment-service/.env**
```env
DB_HOST=localhost
DB_PORT=5435
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=payment_db

PORT=3004
KAFKA_BROKER=localhost:9092
```

#### **apps/api-gateway/.env**
```env
PORT=3000

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

AUTH_SERVICE_URL=http://localhost:3001
CATALOG_SERVICE_URL=http://localhost:3002
ORDER_SERVICE_URL=http://localhost:3003
PAYMENT_SERVICE_URL=http://localhost:3004
```

### 4. Start Docker Services

Start all databases, Kafka, and Zookeeper:

```bash
# Navigate to docker directory
cd docker

# Start all services
docker-compose up -d

# Verify all containers are running
docker-compose ps

# Expected output: auth-db, catalog-db, order-db, payment-db, kafka, zookeeper
```

**Note**: Wait 10-15 seconds for databases to initialize before proceeding.

### 5. Build Common Libraries

```bash
# Build shared libraries
npm run build:common
```

## Project structure (root-level)

- `apps/` - microservice projects (api-gateway, auth-service, catalog-service, order-service, payment-service)
- `libs/` - shared libraries (common, database)
- `docker/` - docker-compose files and service Dockerfiles
- `scripts/` - helper startup and verification scripts
- `docs/` - documentation and guides
- `.github/workflows/` - CI/CD workflow definitions

See `/docs` for detailed guides and `/scripts` for startup scripts.

### 6. Seed Catalog Data (Optional but Recommended)

```bash
# Seed categories, restaurants, and menu items
npx ts-node apps/catalog-service/src/seed.ts
```

### 7. Start All Microservices

Open **5 separate terminal windows** and run:

```bash
# Terminal 1 - Auth Service
npm run start:dev auth-service

# Terminal 2 - Catalog Service
npm run start:dev catalog-service

# Terminal 3 - Order Service
npm run start:dev order-service

# Terminal 4 - Payment Service
npm run start:dev payment-service

# Terminal 5 - API Gateway
npm run start:dev api-gateway
```

**Verify**: Each service should display a message like:
```
Auth Service is running on: http://localhost:3001
```

## 🧪 Testing the API

### Using cURL (Windows PowerShell)

#### 1. Register a New User
```bash
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"email\": \"test@example.com\", \"password\": \"Password123\", \"name\": \"Test User\", \"phoneNumber\": \"1234567890\"}'
```

#### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\": \"test@example.com\", \"password\": \"Password123\"}'
```

**Copy the `accessToken` from the response!**

#### 3. Get All Categories (Authenticated)
```bash
curl http://localhost:3000/api/catalog/categories `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

#### 4. Get All Restaurants (Authenticated)
```bash
curl http://localhost:3000/api/catalog/restaurants `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

#### 5. Create an Order (Authenticated)
```bash
curl -X POST http://localhost:3000/api/orders `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" `
  -d '{\"restaurantId\": \"<restaurant-id-from-step-4>\", \"items\": [{\"menuItemId\": \"<menu-item-id>\", \"quantity\": 2}], \"deliveryAddress\": {\"street\": \"123 Main St\", \"city\": \"Mumbai\", \"state\": \"Maharashtra\", \"zipCode\": \"400001\"}}'
```

#### 6. Get User Orders (Authenticated)
```bash
curl http://localhost:3000/api/orders `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Using Postman

1. Import the environment with base URL: `http://localhost:3000/api`
2. Create a collection with the endpoints above
3. Add `Authorization: Bearer {{token}}` to authenticated requests
4. Save the token from login response to environment variables

## 📁 Project Structure

```
food-delivery-backend/
├── apps/
│   ├── api-gateway/          # API Gateway (Port 3000)
│   │   ├── src/
│   │   │   ├── guards/       # JWT Auth Guard
│   │   │   ├── strategies/   # Passport JWT Strategy
│   │   │   ├── decorators/   # Public route decorator
│   │   │   ├── modules/      # Auth, Catalog, Orders, Payments
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── .env
│   │
│   ├── auth-service/         # Authentication Service (Port 3001)
│   │   ├── src/
│   │   │   ├── entities/     # User Entity
│   │   │   ├── strategies/   # JWT Strategy
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   └── main.ts
│   │   └── .env
│   │
│   ├── catalog-service/      # Catalog Service (Port 3002)
│   │   ├── src/
│   │   │   ├── entities/     # Category, Restaurant, MenuItem
│   │   │   ├── catalog.controller.ts
│   │   │   ├── catalog.service.ts
│   │   │   ├── catalog.module.ts
│   │   │   ├── seed.ts       # Database seeder
│   │   │   └── main.ts
│   │   └── .env
│   │
│   ├── order-service/        # Order Service (Port 3003)
│   │   ├── src/
│   │   │   ├── entities/     # Order, OrderItem
│   │   │   ├── dto/          # Create/Update DTOs
│   │   │   ├── order.controller.ts
│   │   │   ├── order.service.ts
│   │   │   ├── order.module.ts
│   │   │   └── main.ts
│   │   └── .env
│   │
│   └── payment-service/      # Payment Service (Port 3004)
│       ├── src/
│       │   ├── entities/     # Payment Entity
│       │   ├── dto/          # Payment DTOs
│       │   ├── payment.controller.ts
│       │   ├── payment.service.ts
│       │   ├── payment.module.ts
│       │   └── main.ts
│       └── .env
│
├── libs/
│   ├── common/               # Shared libraries
│   │   ├── src/
│   │   │   ├── pipes/        # Zod Validation Pipe
│   │   │   ├── decorators/   # Custom Decorators
│   │   │   ├── schemas/      # Zod Schemas (Auth, Catalog, Order)
│   │   │   └── index.ts
│   │   └── tsconfig.lib.json
│   │
│   └── database/             # Database configs
│       └── src/
│
├── docker/
│   └── docker-compose.yml    # Docker services configuration
│
├── nest-cli.json             # NestJS monorepo configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies & scripts
├── .gitignore                # Git ignore file
└── README.md                 # This file
```

## 🔐 Security Features

- ✅ JWT-based authentication on all routes (except register/login)
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Token expiration (Access: 15min, Refresh: 7 days)
- ✅ User-specific data access (users can only see their own orders/payments)
- ✅ Input validation with Zod schemas
- ✅ CORS enabled on API Gateway

## 📊 Database Schema

### Auth Service (auth_db)
- **users**: id, email, password, name, phoneNumber, isActive, createdAt, updatedAt

### Catalog Service (catalog_db)
- **categories**: id, name, description, imageUrl, isActive, createdAt, updatedAt
- **restaurants**: id, name, address, city, phone, imageUrl, rating, isActive, isOpen, createdAt, updatedAt
- **menu_items**: id, name, description, price, imageUrl, isVegetarian, isAvailable, categoryId, restaurantId, createdAt, updatedAt

### Order Service (order_db)
- **orders**: id, userId, restaurantId, restaurantName, status, subtotal, deliveryFee, tax, total, deliveryAddress (jsonb), deliveryInstructions, paymentId, createdAt, updatedAt
- **order_items**: id,