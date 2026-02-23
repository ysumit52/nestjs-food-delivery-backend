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

---

### Step 2: Verify Local Build
```powershell
npm install
npm run verify:build
```

---

### Step 3: Build Docker Images
```powershell
npm run docker:build
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

---

### Step 5: View Logs
```powershell
npm run docker:logs
```

---

## Alternative: Run Services Locally (Easier)

```powershell
# Terminal 1: Start Docker containers (databases only)
cd docker
docker-compose up -d
cd ..
Start-Sleep -Seconds 15

# Terminal 2: Start services (after 15 seconds)
npm install
npm run start:all
```

---

## Clean Up & Stop

```powershell
npm run docker:down
npm run docker:clean
```

---

## Access GUI Tools

- **pgAdmin** (Database UI): http://localhost:5050
  - Email: admin@admin.com
  - Password: admin

- **Postman** (API Testing): Import `postman-collection.json`
