# API Documentation - Inventory Management System

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 📍 Authentication Endpoints

### 1. Login
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "admin",
    "fullName": "System Administrator",
    "role": "site_admin",
    "isFirstLogin": false
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 2. Get Current User
**GET** `/auth/me`

Get authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "admin",
    "fullName": "System Administrator",
    "role": "site_admin",
    "isFirstLogin": false,
    "createdAt": "2025-01-30T10:00:00.000Z"
  }
}
```

---

### 3. Update Profile
**PUT** `/auth/profile`

Update user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "username": "newusername",
  "fullName": "John Doe",
  "currentPassword": "oldpass123",
  "newPassword": "newpass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "newusername",
    "fullName": "John Doe",
    "role": "editor",
    "isFirstLogin": false
  }
}
```

---

### 4. Logout
**POST** `/auth/logout`

Logout user and log the action.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 📍 User Management Endpoints (Admin Only)

### 1. Get All Users
**GET** `/users`

Retrieve all users in the system.

**Headers:**
```
Authorization: Bearer <token>
Role Required: site_admin
```

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "users": [
    {
      "id": "507f1f77bcf86cd799439011",
      "username": "admin",
      "fullName": "System Administrator",
      "role": "site_admin",
      "isFirstLogin": false,
      "createdAt": "2025-01-30T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Create User
**POST** `/users`

Create a new user (admin only).

**Headers:**
```
Authorization: Bearer <token>
Role Required: site_admin
```

**Request Body:**
```json
{
  "username": "newuser",
  "password": "password123",
  "role": "editor"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "username": "newuser",
    "role": "editor",
    "isFirstLogin": true,
    "createdAt": "2025-01-30T11:00:00.000Z"
  }
}
```

---

### 3. Update User Role
**PUT** `/users/:id`

Update a user's role.

**Headers:**
```
Authorization: Bearer <token>
Role Required: site_admin
```

**Request Body:**
```json
{
  "role": "viewer"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User role updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "username": "newuser",
    "role": "viewer"
  }
}
```

---

### 4. Delete User
**DELETE** `/users/:id`

Delete a user from the system.

**Headers:**
```
Authorization: Bearer <token>
Role Required: site_admin
```

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## 📍 Inventory Item Endpoints

### 1. Get All Items
**GET** `/items`

Retrieve all inventory items.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "items": [
    {
      "id": "507f1f77bcf86cd799439013",
      "name": "Laptop - Dell XPS 15",
      "category": "Electronics",
      "quantity": 25,
      "price": 1299.99,
      "description": "High-performance laptop for business use",
      "lowStockThreshold": 10,
      "stockStatus": "ok",
      "createdAt": "2025-01-30T10:00:00.000Z",
      "lastUpdated": "2025-01-30T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Single Item
**GET** `/items/:id`

Retrieve a specific inventory item.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "item": {
    "id": "507f1f77bcf86cd799439013",
    "name": "Laptop - Dell XPS 15",
    "category": "Electronics",
    "quantity": 25,
    "price": 1299.99,
    "description": "High-performance laptop for business use",
    "lowStockThreshold": 10,
    "stockStatus": "ok"
  }
}
```

---

### 3. Create Item
**POST** `/items`

Add a new inventory item.

**Headers:**
```
Authorization: Bearer <token>
Role Required: editor or site_admin
```

**Request Body:**
```json
{
  "name": "Wireless Keyboard",
  "category": "Electronics",
  "quantity": 50,
  "price": 49.99,
  "description": "Mechanical wireless keyboard",
  "lowStockThreshold": 15,
  "reason": "New product line addition"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Item created successfully",
  "item": {
    "id": "507f1f77bcf86cd799439014",
    "name": "Wireless Keyboard",
    "category": "Electronics",
    "quantity": 50,
    "price": 49.99,
    "description": "Mechanical wireless keyboard",
    "lowStockThreshold": 15,
    "stockStatus": "ok",
    "createdAt": "2025-01-30T12:00:00.000Z",
    "lastUpdated": "2025-01-30T12:00:00.000Z"
  }
}
```

---

### 4. Update Item
**PUT** `/items/:id`

Update an existing inventory item.

**Headers:**
```
Authorization: Bearer <token>
Role Required: editor or site_admin
```

**Request Body:**
```json
{
  "quantity": 75,
  "price": 44.99,
  "reason": "Restock and price adjustment"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Item updated successfully",
  "item": {
    "id": "507f1f77bcf86cd799439014",
    "name": "Wireless Keyboard",
    "category": "Electronics",
    "quantity": 75,
    "price": 44.99,
    "lastUpdated": "2025-01-30T13:00:00.000Z"
  }
}
```

---

### 5. Delete Item
**DELETE** `/items/:id`

Remove an item from inventory.

**Headers:**
```
Authorization: Bearer <token>
Role Required: editor or site_admin
```

**Request Body:**
```json
{
  "reason": "Product discontinued"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Item deleted successfully"
}
```

---

### 6. Get Statistics
**GET** `/items/stats`

Get inventory statistics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalItems": 10,
    "lowStockItems": 2,
    "totalValue": "15234.50",
    "categories": 4
  }
}
```

---

## 📍 Logs Endpoints

### 1. Get All Logs
**GET** `/logs?page=1&limit=50`

Retrieve activity logs with pagination.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)
- `action` (optional): Filter by action type
- `userId` (optional): Filter by user ID

**Response (200):**
```json
{
  "success": true,
  "count": 50,
  "total": 150,
  "page": 1,
  "pages": 3,
  "logs": [
    {
      "id": "507f1f77bcf86cd799439015",
      "action": "ADD",
      "reason": "New product line addition",
      "details": "Added new item: Wireless Keyboard (Qty: 50, Price: $49.99)",
      "userId": "507f1f77bcf86cd799439011",
      "username": "admin",
      "itemId": "507f1f77bcf86cd799439014",
      "itemName": "Wireless Keyboard",
      "timestamp": "2025-01-30T12:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Recent Activity
**GET** `/logs/recent`

Get the 10 most recent activity logs.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "logs": [ ...recent_logs ]
}
```

---

### 3. Get Logs by Action
**GET** `/logs/action/:action`

Get logs filtered by action type.

**Headers:**
```
Authorization: Bearer <token>
```

**Action Types:**
- ADD
- UPDATE
- DELETE
- USER_CREATED
- USER_DELETED
- USER_UPDATED
- LOGIN
- LOGOUT

**Response (200):**
```json
{
  "success": true,
  "count": 15,
  "action": "ADD",
  "logs": [ ...filtered_logs ]
}
```

---

### 4. Get User Logs
**GET** `/logs/user/:userId`

Get logs for a specific user.

**Headers:**
```
Authorization: Bearer <token>
```

**Note:** Users can only access their own logs unless they are site_admin.

**Response (200):**
```json
{
  "success": true,
  "count": 25,
  "logs": [ ...user_logs ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": ["Field is required", "Invalid format"]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token provided. Authorization denied."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Required role: site_admin"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error"
}
```

---

## Rate Limiting
Currently, no rate limiting is implemented. For production, consider adding rate limiting middleware.

## Versioning
Current API version: v1

Future versions will be accessible via `/api/v2/...`

---

## Testing Examples

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Get Items:**
```bash
curl -X GET http://localhost:5000/api/items \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Create Item:**
```bash
curl -X POST http://localhost:5000/api/items \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Item",
    "category": "Test",
    "quantity": 10,
    "price": 99.99,
    "reason": "Testing"
  }'
```

### Using JavaScript (Fetch)

```javascript
// Login
const login = async () => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'admin',
      password: 'admin123'
    })
  });
  const data = await response.json();
  return data.token;
};

// Get Items
const getItems = async (token) => {
  const response = await fetch('http://localhost:5000/api/items', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};
```

---

## Support

For issues or questions, please refer to the main README.md file or contact the development team.
