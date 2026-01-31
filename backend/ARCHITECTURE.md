# System Architecture & Implementation Report
## Inventory Management System - Backend

**Course**: Web and Mobile Programming  
**Lab Assignment**: Lab Assignment Two  
**Student**: Student 2 (Backend & Database Developer)  
**Date**: January 30, 2025  

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Database Design](#database-design)
5. [API Architecture](#api-architecture)
6. [Security Implementation](#security-implementation)
7. [Role-Based Access Control](#role-based-access-control)
8. [Audit Trail System](#audit-trail-system)
9. [Implementation Details](#implementation-details)
10. [Testing & Validation](#testing--validation)
11. [Deployment Strategy](#deployment-strategy)
12. [Future Enhancements](#future-enhancements)

---

## 1. Executive Summary

This document outlines the backend architecture and implementation of the Inventory Management System (IMS), developed as part of Lab Assignment Two. The system provides a robust RESTful API built with the MERN stack, featuring comprehensive authentication, authorization, inventory management, and audit trail capabilities.

### Key Features Implemented:
- JWT-based authentication system
- Role-based access control (RBAC) with three user roles
- Complete CRUD operations for inventory items
- Comprehensive audit logging system
- User management for administrators
- Input validation and error handling
- Secure password hashing
- RESTful API design principles

---

## 2. System Architecture

### 2.1 Architectural Pattern

The backend follows a **layered architecture** pattern, which separates concerns into distinct layers:

```
┌─────────────────────────────────────────┐
│         Client Layer (Frontend)          │
│            React Application             │
└─────────────────────────────────────────┘
                    ↓ HTTP/HTTPS
┌─────────────────────────────────────────┐
│         Presentation Layer               │
│       Express Routes & Middleware        │
│  - Authentication Middleware             │
│  - Authorization Middleware              │
│  - Error Handler                         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Business Logic Layer             │
│            Controllers                   │
│  - authController                        │
│  - userController                        │
│  - itemController                        │
│  - logController                         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Data Access Layer                │
│         Mongoose Models                  │
│  - User Model                            │
│  - Item Model                            │
│  - Log Model                             │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Database Layer                   │
│            MongoDB                       │
└─────────────────────────────────────────┘
```

### 2.2 Design Principles

The implementation adheres to several key design principles:

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Single Responsibility Principle**: Each module handles one aspect of functionality
3. **DRY (Don't Repeat Yourself)**: Reusable middleware and utility functions
4. **RESTful Design**: Standard HTTP methods and status codes
5. **Security First**: Authentication and authorization at every layer
6. **Scalability**: Modular design allows easy feature additions

---

## 3. Technology Stack

### 3.1 Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | v16+ | Runtime environment |
| Express.js | v4.18.2 | Web application framework |
| MongoDB | v5+ | NoSQL database |
| Mongoose | v8.0.3 | MongoDB ODM |

### 3.2 Key Dependencies

| Package | Purpose |
|---------|---------|
| jsonwebtoken | JWT token generation and verification |
| bcryptjs | Password hashing |
| dotenv | Environment variable management |
| cors | Cross-origin resource sharing |
| express-validator | Input validation |

### 3.3 Development Dependencies

| Package | Purpose |
|---------|---------|
| nodemon | Auto-restart during development |

---

## 4. Database Design

### 4.1 Schema Design

#### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, indexed),
  password: String (hashed with bcrypt),
  fullName: String,
  role: String (enum: viewer, editor, site_admin),
  isFirstLogin: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Design Decisions:**
- Username is unique and indexed for fast lookups
- Passwords are hashed before storage (never stored in plain text)
- Role field uses enumeration to ensure data integrity
- Timestamps track user lifecycle

#### Items Collection
```javascript
{
  _id: ObjectId,
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

**Design Decisions:**
- Quantity and price have minimum value constraints
- lowStockThreshold enables automatic low-stock detection
- lastUpdated tracks most recent modification
- Virtual field 'stockStatus' computed from quantity vs threshold

#### Logs Collection
```javascript
{
  _id: ObjectId,
  action: String (enum: ADD, UPDATE, DELETE, etc.),
  reason: String,
  details: String,
  userId: ObjectId (ref: User),
  username: String (snapshot),
  itemId: ObjectId (ref: Item, optional),
  itemName: String (snapshot, optional),
  previousData: Mixed (optional),
  newData: Mixed (optional),
  timestamp: Date (indexed)
}
```

**Design Decisions:**
- Immutable audit trail (logs are never modified)
- Stores snapshots of usernames and item names for historical accuracy
- previousData and newData enable change tracking
- Timestamp indexed for efficient querying
- Reference to User maintains relational integrity

### 4.2 Indexing Strategy

| Collection | Index | Purpose |
|------------|-------|---------|
| users | username (unique) | Fast user lookup during authentication |
| logs | timestamp (descending) | Efficient log retrieval |
| logs | userId | Quick user activity lookup |
| logs | action | Filter logs by action type |

### 4.3 Data Relationships

```
User (1) ──────► (N) Logs
              creates

Item (1) ──────► (N) Logs
              references
```

---

## 5. API Architecture

### 5.1 RESTful Endpoint Design

The API follows REST principles with predictable URL patterns:

```
/api/auth/*       - Authentication endpoints
/api/users/*      - User management (admin only)
/api/items/*      - Inventory operations
/api/logs/*       - Audit trail access
```

### 5.2 HTTP Methods & Status Codes

| Method | Purpose | Success Code | Error Codes |
|--------|---------|--------------|-------------|
| GET | Retrieve resources | 200 OK | 401, 403, 404, 500 |
| POST | Create resources | 201 Created | 400, 401, 403, 500 |
| PUT | Update resources | 200 OK | 400, 401, 403, 404, 500 |
| DELETE | Remove resources | 200 OK | 401, 403, 404, 500 |

### 5.3 Request/Response Format

**Standard Success Response:**
```json
{
  "success": true,
  "message": "Operation completed",
  "data": { ... }
}
```

**Standard Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // validation errors if applicable
}
```

---

## 6. Security Implementation

### 6.1 Authentication System

**JWT (JSON Web Token) Authentication:**
- Tokens generated upon successful login
- Default expiration: 7 days (configurable)
- Token includes user ID and is signed with secret key
- Tokens required for all protected routes

**Implementation:**
```javascript
// Token Generation
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRE
});

// Token Verification (Middleware)
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### 6.2 Password Security

**bcrypt Hashing:**
- Salt rounds: 10
- Automatic hashing before database storage
- Passwords never stored or transmitted in plain text

**Implementation:**
```javascript
// Pre-save middleware in User model
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

### 6.3 Input Validation

All user inputs are validated before processing:
- Required field checks
- Data type validation
- Length constraints
- Format validation (e.g., email, phone)
- Mongoose schema validation as final defense

### 6.4 Error Handling

Comprehensive error handling prevents information leakage:
- Specific error messages for validation issues
- Generic messages for authentication failures
- Stack traces only in development mode
- Centralized error handling middleware

### 6.5 CORS Configuration

Cross-Origin Resource Sharing configured for security:
- Whitelist specific frontend origins
- Credentials support enabled
- Configurable via environment variables

---

## 7. Role-Based Access Control

### 7.1 User Roles

| Role | Permissions | Description |
|------|-------------|-------------|
| **viewer** | - View dashboard<br>- View inventory items<br>- View logs | Read-only access for monitoring |
| **editor** | - All viewer permissions<br>- Add items<br>- Update items<br>- Delete items | Inventory management capabilities |
| **site_admin** | - All editor permissions<br>- Create users<br>- Update user roles<br>- Delete users | Full system administration |

### 7.2 Authorization Middleware

**Implementation:**
```javascript
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }
    next();
  };
};
```

### 7.3 Endpoint Protection

Routes are protected at the middleware level:

```javascript
// Example: Items route
router.route('/')
  .get(authenticate, getItems)  // All authenticated users
  .post(authenticate, authorize('editor', 'site_admin'), createItem);
```

### 7.4 Self-Service Restrictions

Users cannot:
- Change their own role
- Delete their own account (admin only)
- Delete the last admin user (system protection)

---

## 8. Audit Trail System

### 8.1 Logged Actions

All state-changing operations are logged:

| Action Type | Trigger | Information Captured |
|-------------|---------|---------------------|
| LOGIN | User authentication | User ID, username, timestamp |
| LOGOUT | User logout | User ID, username, timestamp |
| ADD | New item created | Item details, creator, reason |
| UPDATE | Item modified | Before/after data, modifier, reason |
| DELETE | Item removed | Item details, remover, reason |
| USER_CREATED | Admin creates user | New user details, creator |
| USER_UPDATED | User/role modified | Changes made, modifier |
| USER_DELETED | User removed | Deleted user info, remover |

### 8.2 Log Data Integrity

**Immutability:**
- Logs are never modified after creation
- No update or delete operations on logs
- Timestamp ordering ensures chronological accuracy

**Snapshot Approach:**
- Username and item names stored directly in logs
- Prevents broken references if users/items deleted
- Maintains historical accuracy

### 8.3 Audit Requirements

**Reason Field:**
All state-changing operations require a reason:
```javascript
{
  "name": "Laptop",
  "quantity": 10,
  "reason": "New stock arrival"  // Required
}
```

**Change Tracking:**
For updates, both previous and new data are stored:
```javascript
{
  "previousData": { quantity: 10, price: 999.99 },
  "newData": { quantity: 15, price: 899.99 }
}
```

---

## 9. Implementation Details

### 9.1 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection setup
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── itemController.js    # Inventory CRUD operations
│   ├── logController.js     # Log retrieval
│   └── userController.js    # User management
├── middleware/
│   ├── auth.js              # JWT verification & authorization
│   └── errorHandler.js      # Centralized error handling
├── models/
│   ├── User.js              # User schema & methods
│   ├── Item.js              # Item schema & virtuals
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
├── API_DOCUMENTATION.md
├── seed.js                  # Database seeding
└── server.js                # Express app setup
```

### 9.2 Key Implementation Patterns

**Async/Await Error Handling:**
```javascript
try {
  const items = await Item.find();
  res.json({ success: true, items });
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ success: false, message: 'Server error' });
}
```

**Middleware Chaining:**
```javascript
router.post('/items', 
  authenticate,                          // Verify JWT
  authorize('editor', 'site_admin'),     // Check role
  createItem                             // Execute handler
);
```

**Transaction-like Operations:**
```javascript
// Create item + log in sequence
const item = await Item.create(itemData);
await Log.create(logData);
```

### 9.3 Environment Configuration

All sensitive data and configuration use environment variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventory_management
JWT_SECRET=secure_random_string
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

### 9.4 Database Seeding

The seed script initializes the system with:
- Default admin user (username: admin, password: admin123)
- Sample editor and viewer users
- 10 sample inventory items across multiple categories
- Initial activity logs

**Usage:**
```bash
npm run seed
```

---

## 10. Testing & Validation

### 10.1 Manual Testing

The API was tested using:
- **Postman**: Collection of all endpoints
- **cURL**: Command-line testing
- **Browser DevTools**: Frontend integration testing

### 10.2 Test Scenarios

| Scenario | Expected Result | Status |
|----------|----------------|--------|
| Login with valid credentials | JWT token returned | ✅ Pass |
| Login with invalid credentials | 401 error | ✅ Pass |
| Access protected route without token | 401 error | ✅ Pass |
| Viewer attempts to create item | 403 error | ✅ Pass |
| Editor creates item without reason | 400 error | ✅ Pass |
| Admin deletes last admin | 400 error | ✅ Pass |
| Update item logs changes | Log entry created | ✅ Pass |
| Username change notifies admin | Log entry created | ✅ Pass |

### 10.3 Validation Testing

All inputs were tested for:
- ✅ Required field validation
- ✅ Data type validation
- ✅ Length constraints
- ✅ Format validation
- ✅ Boundary conditions (e.g., negative quantities)

---

## 11. Deployment Strategy

### 11.1 Deployment Options

**Option 1: Heroku**
- Easy deployment via Git
- Free tier available for testing
- Automatic SSL certificates
- Environment variable management

**Option 2: Railway**
- Modern deployment platform
- GitHub integration
- Automatic deployments on push
- Database hosting included

**Option 3: Render**
- Free tier with generous limits
- Auto-deploy from GitHub
- Built-in database support
- Health check monitoring

### 11.2 Environment Setup

Production environment requires:
1. MongoDB Atlas account (cloud database)
2. Strong JWT secret key (generate random string)
3. CORS origin set to production frontend URL
4. NODE_ENV set to 'production'

### 11.3 Database Considerations

**Local Development:**
```
mongodb://localhost:27017/inventory_management
```

**Production (MongoDB Atlas):**
```
mongodb+srv://username:password@cluster.mongodb.net/inventory_management
```

### 11.4 Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Admin user seeded
- [ ] CORS origin updated
- [ ] Error handling verified
- [ ] API documentation updated
- [ ] Frontend integration tested

---

## 12. Future Enhancements

### 12.1 Planned Features

1. **Email Notifications**
   - Low stock alerts
   - Username change notifications
   - Daily/weekly reports

2. **Advanced Reporting**
   - Inventory value trends
   - Category-wise analysis
   - User activity reports
   - Export to CSV/Excel

3. **Real-time Updates**
   - WebSocket integration
   - Live inventory updates
   - Real-time notifications

4. **Enhanced Security**
   - Rate limiting
   - Two-factor authentication
   - Session management
   - IP whitelist/blacklist

5. **Image Support**
   - Item images upload
   - Image storage (AWS S3 / Cloudinary)
   - Thumbnail generation

6. **Batch Operations**
   - Bulk item import/export
   - Mass updates
   - Batch deletion

7. **API Versioning**
   - Version 2 endpoints
   - Backward compatibility
   - Deprecation warnings

8. **Analytics Dashboard**
   - Usage statistics
   - Performance metrics
   - Error tracking

### 12.2 Performance Optimizations

1. **Database**
   - Add compound indexes for common queries
   - Implement pagination for all list endpoints
   - Add caching layer (Redis)

2. **API**
   - Implement request rate limiting
   - Add response compression
   - Optimize query aggregations

3. **Security**
   - Add API key authentication option
   - Implement refresh tokens
   - Add request signing

---

## 13. Conclusion

The Inventory Management System backend provides a robust, secure, and scalable foundation for managing inventory operations. The implementation successfully meets all requirements specified in the lab assignment:

✅ **Authentication & Authorization**: JWT-based system with RBAC  
✅ **Inventory Operations**: Complete CRUD functionality  
✅ **User Management**: Admin capabilities for user lifecycle  
✅ **Audit Trail**: Comprehensive logging of all actions  
✅ **Security**: Password hashing, input validation, error handling  
✅ **Documentation**: Complete API and setup documentation  
✅ **Database Design**: Efficient schemas with proper relationships  
✅ **RESTful API**: Standard conventions and practices  

The modular architecture and clear separation of concerns make the system maintainable and extensible for future enhancements.

---

## 14. References

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT.io - JSON Web Tokens](https://jwt.io/)
- [REST API Best Practices](https://restfulapi.net/)
- [OWASP Security Guidelines](https://owasp.org/)

---

**Prepared by**: Student 2 (Backend & Database Developer)  
**Date**: January 30, 2025  
**Version**: 1.0
