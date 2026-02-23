# Using Postman with Food Delivery Backend

## Quick Setup

### 1. Import the Collection

1. Open **Postman**
2. Click **File** → **Import**
3. Select `postman-collection.json` from the project root
4. The collection will be imported with all endpoints

### 2. Start Your Services

Make sure all services are running:
```bash
npm run start:all
```

Or start Docker containers first:
```bash
docker-compose -f docker up -d
```

---

## Service Base URLs

| Service | URL | Port |
|---------|-----|------|
| Auth Service | `http://localhost:3001` | 3001 |
| Catalog Service | `http://localhost:3002` | 3002 |
| Order Service | `http://localhost:3003` | 3003 |
| Payment Service | `http://localhost:3004` | 3004 |
| API Gateway | `http://localhost:3000` | 3000 |

---

... (same content truncated for brevity)
