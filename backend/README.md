# Inventory Management System - Backend

A RESTful API backend for the Inventory Management System built with Node.js, Express.js, and MongoDB.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (RBAC)
- **User Management**: Admin can create, update, and delete users
- **Inventory Management**: Full CRUD operations for inventory items
- **Audit Trail**: Comprehensive logging of all system activities
- **Role-Based Permissions**:
  - **Viewer**: Read-only access to dashboard and logs
  - **Editor**: Can add, update, and delete inventory items
  - **Site Admin**: Full system access including user management

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher) - Local installation or MongoDB Atlas account
- npm or yarn

## 🛠️ Installation

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the following:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/inventory_management
   JWT_SECRET=your_secure_random_string_here
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Seed the database** (optional but recommended for development):
   ```bash
   npm run seed
   ```

5. **Start the server**:
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## 📦 Database Schema

### Users Collection
```javascript
{
  username: String (unique),
  password: String (hashed),
  fullName: String,
  role: String (viewer | editor | site_admin),
  isFirstLogin: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Items Collection
```javascript
{
  name: String,
  category: String,
  quantity: Number,
  price: Number,
  description: String,
  lowStockThreshold: Number,
  createdAt: Date,
  lastUpdated: Date
}
```

### Logs Collection
```javascript
{
  action: String (ADD | UPDATE | DELETE | USER_CREATED | USER_DELETED | etc.),
  reason: String,
  details: String,
  userId: ObjectId,
  username: String,
  itemId: ObjectId (optional),
  itemName: String (optional),
  previousData: Object (optional),
  newData: Object (optional),
  timestamp: Date
}
```

## 🔌 API Endpoints

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "admin",
    "fullName": "System Administrator",
    "role": "site_admin",
    "isFirstLogin": false
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}

Response:
{
  "success": true,
  "user": { ...user_data }
}
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "new_username",
  "fullName": "New Name",
  "currentPassword": "current_pass",
  "newPassword": "new_pass"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

### User Management (Admin Only)

#### Get All Users
```http
GET /api/users
Authorization: Bearer {token}
```

#### Create User
```http
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "newuser",
  "password": "password123",
  "role": "editor"
}
```

#### Update User Role
```http
PUT /api/users/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "role": "viewer"
}
```

#### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer {token}
```

### Inventory Items

#### Get All Items
```http
GET /api/items
Authorization: Bearer {token}

Response:
{
  "success": true,
  "count": 10,
  "items": [ ...items ]
}
```

#### Get Single Item
```http
GET /api/items/:id
Authorization: Bearer {token}
```

#### Create Item (Editor/Admin)
```http
POST /api/items
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Laptop",
  "category": "Electronics",
  "quantity": 10,
  "price": 999.99,
  "description": "High-performance laptop",
  "lowStockThreshold": 5,
  "reason": "New stock arrival"
}
```

#### Update Item (Editor/Admin)
```http
PUT /api/items/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 15,
  "price": 899.99,
  "reason": "Restock and price adjustment"
}
```

#### Delete Item (Editor/Admin)
```http
DELETE /api/items/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Item discontinued"
}
```

#### Get Statistics
```http
GET /api/items/stats
Authorization: Bearer {token}

Response:
{
  "success": true,
  "stats": {
    "totalItems": 10,
    "lowStockItems": 2,
    "totalValue": "15000.00",
    "categories": 3
  }
}
```

### Logs

#### Get All Logs
```http
GET /api/logs?page=1&limit=50
Authorization: Bearer {token}

Response:
{
  "success": true,
  "count": 50,
  "total": 150,
  "page": 1,
  "pages": 3,
  "logs": [ ...logs ]
}
```

#### Get Recent Activity
```http
GET /api/logs/recent
Authorization: Bearer {token}
```

#### Get Logs by Action
```http
GET /api/logs/action/ADD
Authorization: Bearer {token}
```

#### Get User Logs
```http
GET /api/logs/user/:userId
Authorization: Bearer {token}
```

## 🔐 Default Credentials (After Seeding)

| Role | Username | Password |
|------|----------|----------|
| Site Admin | admin | admin123 |
| Editor | editor | editor123 |
| Viewer | viewer | viewer123 |

**⚠️ IMPORTANT**: Change these passwords in production!

## 🏗️ Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── itemController.js    # Inventory operations
│   ├── logController.js     # Logging operations
│   └── userController.js    # User management
├── middleware/
│   ├── auth.js              # Authentication & authorization
│   └── errorHandler.js      # Error handling
├── models/
│   ├── User.js              # User schema
│   ├── Item.js              # Item schema
│   └── Log.js               # Log schema
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── itemRoutes.js        # Inventory endpoints
│   ├── logRoutes.js         # Log endpoints
│   └── userRoutes.js        # User management endpoints
├── .env.example             # Environment template
├── .gitignore
├── package.json
├── README.md
├── seed.js                  # Database seeding script
└── server.js                # Express server
```

## 🔒 Security Features

- **Password Hashing**: Passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Different permissions for different roles
- **Input Validation**: Request validation to prevent invalid data
- **Error Handling**: Comprehensive error handling and logging
- **CORS Protection**: Configurable CORS settings
- **Audit Trail**: All actions are logged for accountability

## 🧪 Testing the API

You can test the API using:
- **Postman**: Import the endpoints and test
- **cURL**: Command-line testing
- **REST Client**: VS Code extension

Example cURL request:
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get items (replace TOKEN with actual JWT)
curl -X GET http://localhost:5000/api/items \
  -H "Authorization: Bearer TOKEN"
```

## 📊 Database Setup

### Local MongoDB
```bash
# Install MongoDB (macOS)
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify connection
mongosh
```

### MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

## 🚀 Deployment

### Heroku
```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

### Render
1. Create new Web Service
2. Connect repository
3. Add environment variables
4. Deploy

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/inventory_management |
| JWT_SECRET | Secret key for JWT | your_random_secret_string |
| JWT_EXPIRE | Token expiration time | 7d |
| CORS_ORIGIN | Frontend URL | http://localhost:5173 |
| NODE_ENV | Environment | development/production |

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ...response_data }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ...validation_errors ]
}
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access (for Atlas)

### JWT Authentication Errors
- Check if JWT_SECRET is set
- Verify token is sent in Authorization header
- Ensure token hasn't expired

### CORS Errors
- Update CORS_ORIGIN in `.env`
- Check frontend URL matches

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)

## 👥 Contributors

**Student 2** - Backend & Database Developer

## 📄 License

MIT License - see LICENSE file for details
