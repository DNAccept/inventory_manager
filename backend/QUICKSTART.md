# Quick Start Guide - Backend Setup

Get the Inventory Management System backend running in 5 minutes!

---

## Prerequisites Checklist

Make sure you have these installed:
- [ ] Node.js (v16 or higher) - [Download](https://nodejs.org/)
- [ ] MongoDB (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- [ ] Git
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/Command Prompt

**Check versions:**
```bash
node --version   # Should be v16+
npm --version    # Should be 8+
mongod --version # Should be v5+
```

---

## Step 1: Get the Code

```bash
# Clone or download the repository
cd path/to/backend

# Or if starting fresh
mkdir backend
cd backend
# Copy all backend files here
```

---

## Step 2: Install Dependencies

```bash
npm install
```

This will install:
- express (web framework)
- mongoose (MongoDB ODM)
- jsonwebtoken (authentication)
- bcryptjs (password hashing)
- cors (cross-origin requests)
- dotenv (environment variables)
- And more...

---

## Step 3: Start MongoDB

### macOS (with Homebrew)
```bash
brew services start mongodb-community
```

### Windows
1. Open Services (Win + R, type `services.msc`)
2. Find "MongoDB Server"
3. Right-click > Start

### Linux
```bash
sudo systemctl start mongod
```

### Verify MongoDB is Running
```bash
mongosh
# You should see MongoDB shell
# Type: exit
```

---

## Step 4: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env file (use nano, vim, or code editor)
nano .env
```

**Minimal .env configuration:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventory_management
JWT_SECRET=my_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**Important:** Generate a secure JWT secret for production!

---

## Step 5: Seed the Database

```bash
npm run seed
```

This will create:
- ✅ Default admin user (username: `admin`, password: `admin123`)
- ✅ Sample editor user (username: `editor`, password: `editor123`)
- ✅ Sample viewer user (username: `viewer`, password: `viewer123`)
- ✅ 10 sample inventory items
- ✅ Initial activity logs

---

## Step 6: Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Or production mode
npm start
```

You should see:
```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 Inventory Management System API                      ║
║                                                            ║
║   Server running in development mode                      ║
║   Port: 5000                                              ║
║   Database: MongoDB                                        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## Step 7: Test the API

### Option 1: Browser
Open your browser and visit:
```
http://localhost:5000/health
```

You should see:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-01-30T12:00:00.000Z"
}
```

### Option 2: cURL
```bash
# Test health endpoint
curl http://localhost:5000/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Option 3: Postman
1. Import the `Postman_Collection.json` file
2. Update the `base_url` variable to `http://localhost:5000`
3. Run the "Login" request
4. Copy the token from response
5. Update the `token` variable
6. Test other endpoints!

---

## Default Login Credentials

| Role | Username | Password | Permissions |
|------|----------|----------|-------------|
| Admin | `admin` | `admin123` | Full access |
| Editor | `editor` | `editor123` | Add/Edit/Delete items |
| Viewer | `viewer` | `viewer123` | View only |

**⚠️ Change these passwords immediately in production!**

---

## Quick Test Checklist

Verify everything works:

1. **Health Check**
   ```bash
   curl http://localhost:5000/health
   ```
   ✅ Should return success message

2. **Login**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```
   ✅ Should return token

3. **Get Items** (replace TOKEN)
   ```bash
   curl http://localhost:5000/api/items \
     -H "Authorization: Bearer TOKEN"
   ```
   ✅ Should return 10 sample items

4. **Get Logs** (replace TOKEN)
   ```bash
   curl http://localhost:5000/api/logs \
     -H "Authorization: Bearer TOKEN"
   ```
   ✅ Should return activity logs

---

## Project Structure Quick Reference

```
backend/
├── models/           # Database schemas
│   ├── User.js      # User model
│   ├── Item.js      # Inventory item model
│   └── Log.js       # Activity log model
├── controllers/      # Business logic
│   ├── authController.js
│   ├── itemController.js
│   ├── logController.js
│   └── userController.js
├── routes/          # API endpoints
│   ├── authRoutes.js
│   ├── itemRoutes.js
│   ├── logRoutes.js
│   └── userRoutes.js
├── middleware/      # Express middleware
│   ├── auth.js
│   └── errorHandler.js
├── config/          # Configuration
│   └── database.js
├── server.js        # Main server file
└── seed.js          # Database seeding
```

---

## Common Commands

```bash
# Install dependencies
npm install

# Start development server (auto-restart)
npm run dev

# Start production server
npm start

# Seed database
npm run seed

# Check for code issues
npm run lint

# View MongoDB data
mongosh
use inventory_management
db.items.find().pretty()
db.users.find().pretty()
db.logs.find().sort({timestamp:-1}).limit(10).pretty()
```

---

## Troubleshooting

### MongoDB Not Starting
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Check MongoDB logs
tail -f /usr/local/var/log/mongodb/mongo.log
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 PID_NUMBER

# Or change port in .env
PORT=5001
```

### Cannot Connect to Database
1. Check MongoDB is running
2. Verify connection string in .env
3. Check MongoDB logs for errors

### JWT Errors
1. Ensure JWT_SECRET is set in .env
2. Check token format in Authorization header
3. Verify token hasn't expired

---

## Next Steps

1. **Read the Documentation**
   - `README.md` - Complete setup guide
   - `API_DOCUMENTATION.md` - All API endpoints
   - `ARCHITECTURE.md` - System design details
   - `DEPLOYMENT.md` - Production deployment

2. **Connect the Frontend**
   - Update frontend API URL
   - Test authentication flow
   - Verify all features work

3. **Customize**
   - Modify models for your needs
   - Add new endpoints
   - Customize business logic

4. **Deploy**
   - Follow `DEPLOYMENT.md` guide
   - Use MongoDB Atlas for database
   - Deploy to Heroku/Railway/Render

---

## Getting Help

**Common Issues:**
- Check server logs in terminal
- Review MongoDB logs
- Verify environment variables
- Test endpoints with Postman
- Check network/firewall settings

**Documentation:**
- API endpoints: `API_DOCUMENTATION.md`
- Architecture: `ARCHITECTURE.md`
- Deployment: `DEPLOYMENT.md`
- Full README: `README.md`

---

## Success! 🎉

Your backend is now running at: **http://localhost:5000**

Try these URLs in your browser:
- Health: http://localhost:5000/health
- API root: http://localhost:5000/
- Docs: Read the API_DOCUMENTATION.md file

**Ready to connect your frontend!**

---

**Last Updated**: January 30, 2025
