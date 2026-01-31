# Project Structure

Complete file structure of the Inventory Management System Backend

```
backend/
│
├── 📄 START_HERE.md                    ← Start with this file!
├── 📄 README.md                        ← Complete setup guide
├── 📄 QUICKSTART.md                    ← 5-minute setup
├── 📄 PROJECT_SUMMARY.md               ← Project overview
│
├── 📖 Documentation/
│   ├── API_DOCUMENTATION.md           ← All API endpoints
│   ├── ARCHITECTURE.md                ← System design (for lab report)
│   ├── DEPLOYMENT.md                  ← Deploy to production
│   └── INTEGRATION.md                 ← Connect with frontend
│
├── 🔧 Configuration/
│   ├── .env                           ← Environment variables (ready to use)
│   ├── .env.example                   ← Environment template
│   ├── .gitignore                     ← Git ignore rules
│   ├── package.json                   ← Dependencies & scripts
│   └── config/
│       └── database.js                ← MongoDB connection
│
├── 🗄️ Database Layer/
│   └── models/
│       ├── User.js                    ← User schema with password hashing
│       ├── Item.js                    ← Inventory item schema
│       └── Log.js                     ← Audit log schema
│
├── 🎯 Business Logic/
│   └── controllers/
│       ├── authController.js          ← Login, logout, profile
│       ├── userController.js          ← User management (admin)
│       ├── itemController.js          ← Inventory CRUD operations
│       └── logController.js           ← Activity logs retrieval
│
├── 🔐 Security/
│   └── middleware/
│       ├── auth.js                    ← JWT verification & authorization
│       └── errorHandler.js            ← Error handling & logging
│
├── 🛣️ API Routes/
│   └── routes/
│       ├── authRoutes.js              ← /api/auth/*
│       ├── userRoutes.js              ← /api/users/*
│       ├── itemRoutes.js              ← /api/items/*
│       └── logRoutes.js               ← /api/logs/*
│
├── 🚀 Application/
│   ├── server.js                      ← Main Express server
│   └── seed.js                        ← Database seeding script
│
├── 🧪 Testing/
│   └── Postman_Collection.json        ← API testing collection
│
└── ⚙️ Setup Scripts/
    ├── setup.sh                       ← Setup script (macOS/Linux)
    └── setup.bat                      ← Setup script (Windows)
```

---

## File Purposes

### 📄 Documentation Files

| File | Purpose | When to Read |
|------|---------|--------------|
| `START_HERE.md` | Quick start guide | **First!** |
| `README.md` | Complete setup & usage | After START_HERE |
| `QUICKSTART.md` | 5-minute setup | Quick reference |
| `API_DOCUMENTATION.md` | All API endpoints with examples | When using API |
| `ARCHITECTURE.md` | System design & report | For lab submission |
| `DEPLOYMENT.md` | Production deployment | Before deploying |
| `INTEGRATION.md` | Frontend connection | When connecting UI |
| `PROJECT_SUMMARY.md` | Overview & highlights | For quick overview |

---

### 🔧 Configuration Files

| File | Purpose | Notes |
|------|---------|-------|
| `.env` | Environment variables | **Ready to use!** |
| `.env.example` | Template | For reference |
| `package.json` | Dependencies & scripts | npm commands |
| `config/database.js` | MongoDB connection | Auto-configured |

---

### 🗄️ Database Models (MongoDB Schemas)

| File | Collection | Purpose |
|------|-----------|---------|
| `models/User.js` | users | Authentication & RBAC |
| `models/Item.js` | items | Inventory items |
| `models/Log.js` | logs | Audit trail |

**Key Features:**
- Schema validation
- Password hashing (User)
- Timestamps
- Virtual fields
- Indexes

---

### 🎯 Controllers (Business Logic)

| File | Handles | Endpoints |
|------|---------|-----------|
| `authController.js` | Authentication | login, logout, profile |
| `userController.js` | User management | CRUD for users (admin) |
| `itemController.js` | Inventory | CRUD for items + stats |
| `logController.js` | Audit logs | Query activity logs |

**Each includes:**
- Input validation
- Error handling
- Log creation
- Response formatting

---

### 🔐 Middleware

| File | Purpose | Applied To |
|------|---------|-----------|
| `auth.js` | JWT authentication & role authorization | Protected routes |
| `errorHandler.js` | Centralized error handling | All routes |

---

### 🛣️ Routes (API Endpoints)

| File | Base Path | Protection | Description |
|------|-----------|-----------|-------------|
| `authRoutes.js` | `/api/auth` | Mixed | Login is public, rest protected |
| `userRoutes.js` | `/api/users` | Admin only | User management |
| `itemRoutes.js` | `/api/items` | Role-based | Inventory operations |
| `logRoutes.js` | `/api/logs` | Authenticated | Activity logs |

---

### 🚀 Application Files

| File | Purpose | Command |
|------|---------|---------|
| `server.js` | Express app & server | `npm start` or `npm run dev` |
| `seed.js` | Database initialization | `npm run seed` |

---

### 🧪 Testing

| File | Purpose | Usage |
|------|---------|-------|
| `Postman_Collection.json` | API test collection | Import into Postman |

---

### ⚙️ Setup Scripts

| File | Platform | Usage |
|------|----------|-------|
| `setup.sh` | macOS/Linux | `./setup.sh` |
| `setup.bat` | Windows | `setup.bat` |

---

## Code Organization

### Layered Architecture

```
┌─────────────────────────────────────┐
│         Routes (API Layer)          │  ← HTTP requests
├─────────────────────────────────────┤
│        Middleware (Security)        │  ← Auth, Validation
├─────────────────────────────────────┤
│     Controllers (Business Logic)    │  ← Processing
├─────────────────────────────────────┤
│      Models (Data Layer)            │  ← Database
└─────────────────────────────────────┘
```

---

## Import Patterns

### ES6 Modules
All files use ES6 import/export syntax:
```javascript
import express from 'express';
export default router;
```

### File Naming
- Models: PascalCase (User.js)
- Controllers: camelCase with suffix (userController.js)
- Routes: camelCase with suffix (userRoutes.js)
- Middleware: camelCase (auth.js)

---

## Dependencies

### Production Dependencies
```json
{
  "express": "Web framework",
  "mongoose": "MongoDB ODM",
  "jsonwebtoken": "JWT authentication",
  "bcryptjs": "Password hashing",
  "cors": "CORS handling",
  "dotenv": "Environment variables",
  "express-validator": "Input validation"
}
```

### Development Dependencies
```json
{
  "nodemon": "Auto-restart server"
}
```

---

## Environment Variables

```env
PORT=5000                              # Server port
NODE_ENV=development                   # Environment
MONGODB_URI=mongodb://...             # Database connection
JWT_SECRET=...                        # JWT signing key
JWT_EXPIRE=7d                         # Token expiration
CORS_ORIGIN=http://localhost:5173    # Frontend URL
```

---

## Database Collections

### users
- Stores authentication data
- Roles: viewer, editor, site_admin
- Password hashed with bcrypt

### items
- Inventory items
- Stock tracking
- Price & category management

### logs
- Immutable audit trail
- All actions logged
- Before/after data capture

---

## API Endpoints Summary

### Public
- `POST /api/auth/login` - Login

### Authenticated
- `GET /api/auth/me` - Get profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/logout` - Logout
- `GET /api/items` - List items
- `GET /api/items/:id` - Get item
- `GET /api/logs` - View logs

### Editor/Admin Only
- `POST /api/items` - Add item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Admin Only
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

---

## Getting Started Flow

1. **Read** → START_HERE.md
2. **Run** → setup.sh or setup.bat
3. **Test** → http://localhost:5000/health
4. **Explore** → Import Postman_Collection.json
5. **Learn** → Read API_DOCUMENTATION.md
6. **Build** → Connect your frontend using INTEGRATION.md
7. **Deploy** → Follow DEPLOYMENT.md

---

## File Count Summary

- **JavaScript Files**: 15
- **Documentation Files**: 8
- **Configuration Files**: 5
- **Total Lines of Code**: ~2,500+

---

**Last Updated**: January 30, 2025
