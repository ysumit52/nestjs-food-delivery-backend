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

## Testing Flow

### **Step 1: Register a User**
**Auth Service → Register User**
```json
{
  "email": "user@example.com",
  "password": "Password123",
  "name": "John Doe",
  "phoneNumber": "9876543210"
}
```
✅ Success Response: User ID, email, name, JWT token

---

### **Step 2: Login**
**Auth Service → Login User**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```
✅ Success Response: JWT token, user details

**Copy the JWT token** - You'll use it for protected routes
> **Note:** For now, use the `x-user-id` header (mock auth). In production, include JWT token in Authorization header.

---

### **Step 3: Browse Catalog**

**Catalog Service → Get All Categories**
- No authentication needed
- ✅ Success Response: List of categories

**Catalog Service → Get All Restaurants**
- No authentication needed
- ✅ Success Response: List of restaurants

**Catalog Service → Get Menu Items (Search)**
- Query: `?q=biryani`
- ✅ Success Response: Matching menu items

---

### **Step 4: Create an Order**
**Order Service → Create Order**

**Headers:**
```
Content-Type: application/json
x-user-id: user-123
```

**Body:**
```json
{
  "restaurantId": "550e8400-e29b-41d4-a716-446655440000",
  "items": [
    {
      "menuItemId": "550e8400-e29b-41d4-a716-446655440001",
      "quantity": 2,
      "specialInstructions": "Less spicy"
    }
  ],
  "deliveryAddress": {
    "street": "123 Main Street",
    "city": "Bangalore",
    "state": "Karnataka",
    "zipCode": "560001",
    "landmark": "Near Tech Park"
  },
  "deliveryInstructions": "Ring the bell twice"
}
```
✅ Success Response: Order ID, total amount, estimated delivery time

**Copy the Order ID** - You'll need it for payment

---

### **Step 5: Make a Payment**
**Payment Service → Initiate Payment**

**Headers:**
```
Content-Type: application/json
x-user-id: user-123
```

**Body (Credit Card):**
```json
{
  "orderId": "{{orderId}}",
  "amount": 599.99,
  "paymentMethod": "CREDIT_CARD",
  "cardDetails": {
    "cardNumber": "4532123456789010",
    "expiryMonth": "12",
    "expiryYear": "2025",
    "cvv": "123",
    "cardHolderName": "John Doe"
  }
}
```

**Alternative - UPI:**
```json
{
  "orderId": "{{orderId}}",
  "amount": 599.99,
  "paymentMethod": "UPI",
  "upiDetails": {
    "vpa": "user@googleplay"
  }
}
```

**Alternative - Wallet:**
```json
{
  "orderId": "{{orderId}}",
  "amount": 599.99,
  "paymentMethod": "WALLET",
  "walletDetails": {
    "walletProvider": "PAYTM",
    "walletId": "wallet-123"
  }
}
```

✅ Success Response: Payment ID, status, transaction reference

---

### **Step 6: Verify Payment**
**Payment Service → Verify Payment**

**Body:**
```json
{
  "transactionId": "TXN123456789",
  "status": "SUCCESS"
}
```

---

### **Step 7: Check Order Status**
**Order Service → Get Order By ID**

**Headers:**
```
x-user-id: user-123
```

✅ Response shows updated order status

---

## Using Environment Variables in Postman

### Set Variables for Easy Management

In Postman, click the **eye icon** at top-right → **Manage Environments**

Create a new environment called "Food Delivery Local":

```
userId: user-123
categoryId: 550e8400-e29b-41d4-a716-446655440000
restaurantId: 550e8400-e29b-41d4-a716-446655440000
menuItemId: 550e8400-e29b-41d4-a716-446655440001
orderId: (copy from create order response)
paymentId: (copy from payment response)
```

Then use `{{variableName}}` in requests instead of hardcoding IDs.

---

## Common Headers

### For Authenticated Requests:
```
x-user-id: user-123
Content-Type: application/json
```

### For Protected Routes (Future JWT):
```
Authorization: Bearer {{jwt_token}}
Content-Type: application/json
```

---

## Response Examples

### Login Success
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "phoneNumber": "9876543210",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Order Created
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user-123",
  "restaurantId": "550e8400-e29b-41d4-a716-446655440000",
  "totalAmount": 599.99,
  "status": "PENDING",
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "menuItemId": "550e8400-e29b-41d4-a716-446655440001",
      "quantity": 2,
      "price": 299.99
    }
  ],
  "createdAt": "2024-02-23T10:30:00Z",
  "estimatedDeliveryTime": "45 minutes"
}
```

### Payment Initiated
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "orderId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user-123",
  "amount": 599.99,
  "paymentMethod": "CREDIT_CARD",
  "status": "INITIATED",
  "transactionId": "TXN123456789",
  "createdAt": "2024-02-23T10:35:00Z"
}
```

---

## Validation Rules

### User Registration
- ✅ Email: Valid email format
- ✅ Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number
- ✅ Name: Min 2 characters
- ✅ Phone: Exactly 10 digits

### Order Creation
- ✅ Quantity: Must be positive
- ✅ Zip Code: Exactly 6 digits
- ✅ At least 1 item required
- ✅ Street address: Min 5 characters

### Payment
- ✅ Card Number: Exactly 16 digits
- ✅ CVV: 3-4 digits
- ✅ Expiry: Valid month (01-12) and year (4 digits)
- ✅ Amount: Must be positive

---

## Troubleshooting

### "Connection Refused" Error
- Ensure services are running: `npm run start:all`
- Check if port is correct (e.g., 3001 for auth)
- Verify Docker containers: `docker ps`

### "Validation Error"
- Check request body format against schema
- Ensure all required fields are present
- Use correct data types (email, numbers, etc.)

### "Not Found" Error (404)
- Verify endpoint URL is correct
- Check microservice is running on correct port
- Ensure ID parameters are valid UUIDs

### "User Not Found"
- Register user first via Auth Service
- Check email/password spelling
- Verify user email exists in database

---

## Next Steps

1. **Test all endpoints** to ensure communication works
2. **Set up data** with sample restaurants, categories, menu items
3. **Run integration tests** with sample workflows
4. **Document custom flows** if you add new endpoints
