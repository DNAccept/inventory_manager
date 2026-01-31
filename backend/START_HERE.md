# 🚀 START HERE - Quick Setup Guide

Welcome! This guide will get your backend running in minutes.

---

## 📋 Prerequisites (Install First)

Before starting, make sure you have:

1. **Node.js** (v16 or higher)
   - Download: https://nodejs.org/
   - Check: `node --version`

2. **MongoDB** (v5 or higher)
   - Option A: Local - https://www.mongodb.com/try/download/community
   - Option B: Cloud (MongoDB Atlas) - https://www.mongodb.com/cloud/atlas
   - Check: `mongod --version`

3. **A code editor** (VS Code recommended)
   - Download: https://code.visualstudio.com/

---

## 🎯 Two Ways to Setup

### Option 1: Automated Setup (Recommended)

**For macOS/Linux:**
```bash
cd backend
./setup.sh
```

**For Windows:**
```bash
cd backend
setup.bat
```

The script will:
- ✅ Install all dependencies
- ✅ Create .env file
- ✅ Seed the database
- ✅ Verify everything is ready

---

### Option 2: Manual Setup

**Step 1: Open Terminal in VS Code**
- Open the `backend` folder in VS Code
- Open Terminal: `View` → `Terminal` (or press `` Ctrl+` ``)

**Step 2: Install Dependencies**
```bash
npm install
```

**Step 3: Start MongoDB**

**macOS:**
```bash
brew services start mongodb-community
```

**Windows:**
- Open Services (Win + R, type `services.msc`)
- Find "MongoDB Server" → Right-click → Start

**Linux:**
```bash
sudo systemctl start mongod
```

**Step 4: Seed Database**
```bash
npm run seed
```

**Step 5: Start the Server**
```bash
npm run dev
```

---

## ✅ Verify It's Working

1. **Check the Terminal**
   You should see:
   ```
   ╔════════════════════════════════════════════╗
   ║   🚀 Inventory Management System API      ║
   ║   Server running in development mode      ║
   ║   Port: 5000                              ║
   ╚════════════════════════════════════════════╝
   ```

2. **Test in Browser**
   Open: http://localhost:5000/health
   
   Should return:
   ```json
   {
     "success": true,
     "message": "Server is running"
   }
   ```

3. **Test Login**
   Open Postman or use cURL:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```

---

## 🔑 Default Login Credentials

After seeding, use these credentials:

| Role | Username | Password |
|------|----------|----------|
| **Admin** | admin | admin123 |
| **Editor** | editor | editor123 |
| **Viewer** | viewer | viewer123 |

**⚠️ Important:** Change these in production!

---

## 📁 Project Structure

```
backend/
├── config/           # Database configuration
├── controllers/      # Business logic
├── middleware/       # Auth & error handling
├── models/          # Database schemas
├── routes/          # API endpoints
├── .env             # Environment variables (created)
├── server.js        # Main server file
├── seed.js          # Database seeding
└── package.json     # Dependencies
```

---

## 🛠️ Common Commands

```bash
# Install dependencies
npm install

# Start development server (auto-restart on changes)
npm run dev

# Start production server
npm start

# Seed/reset database
npm run seed

# Check if MongoDB is running
mongosh  # or 'mongo' for older versions
```

---

## 🔧 Troubleshooting

### "MongoDB connection failed"
**Problem:** Cannot connect to MongoDB

**Solutions:**
1. Check MongoDB is running:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status mongod
   
   # Windows
   Check Services app
   ```

2. Verify connection string in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/inventory_management
   ```

3. Try connecting manually:
   ```bash
   mongosh  # Should open MongoDB shell
   ```

---

### "Port 5000 already in use"
**Problem:** Another app is using port 5000

**Solution:** Change port in `.env`:
```
PORT=5001
```

---

### "Cannot find module"
**Problem:** Dependencies not installed

**Solution:**
```bash
npm install
```

---

### "Permission denied" (macOS/Linux)
**Problem:** Cannot run setup.sh

**Solution:**
```bash
chmod +x setup.sh
./setup.sh
```

---

## 🌐 API Endpoints

Once running, you can access:

- **Health Check:** http://localhost:5000/health
- **API Root:** http://localhost:5000/
- **Login:** POST http://localhost:5000/api/auth/login
- **Items:** GET http://localhost:5000/api/items (requires auth)
- **Logs:** GET http://localhost:5000/api/logs (requires auth)

See `API_DOCUMENTATION.md` for complete endpoint list.

---

## 📚 Next Steps

1. **Test the API:**
   - Import `Postman_Collection.json` into Postman
   - Test all endpoints
   - Verify authentication works

2. **Read Documentation:**
   - `API_DOCUMENTATION.md` - All API endpoints
   - `ARCHITECTURE.md` - System design
   - `QUICKSTART.md` - Detailed setup guide

3. **Connect Frontend:**
   - See `INTEGRATION.md` for connecting React frontend
   - Update frontend API URL to `http://localhost:5000/api`

4. **Deploy to Production:**
   - See `DEPLOYMENT.md` for deployment guides
   - Use MongoDB Atlas for cloud database
   - Deploy to Heroku, Railway, or Render

---

## 🎯 Quick Test

Run this in terminal to test everything:

```bash
# 1. Install
npm install

# 2. Seed
npm run seed

# 3. Start server (in new terminal)
npm run dev

# 4. Test (in another terminal)
curl http://localhost:5000/health

# 5. Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 💡 Tips for VS Code

1. **Install Extensions:**
   - MongoDB for VS Code
   - REST Client (test APIs directly in VS Code)
   - ESLint

2. **Integrated Terminal:**
   - Press `` Ctrl+` `` to open terminal
   - Run commands without leaving VS Code

3. **Debug Mode:**
   - Press F5 to start debugging
   - Set breakpoints in your code

---

## 📞 Need Help?

1. Check the logs in terminal
2. Review the error message carefully
3. Check MongoDB is running
4. Verify .env file exists and is configured
5. Read the relevant documentation file
6. Check the QUICKSTART.md for detailed troubleshooting

---

## ✅ Success Checklist

- [ ] Node.js installed and working
- [ ] MongoDB installed and running
- [ ] Dependencies installed (`npm install`)
- [ ] .env file exists
- [ ] Database seeded (`npm run seed`)
- [ ] Server starts without errors (`npm run dev`)
- [ ] Health endpoint responds (http://localhost:5000/health)
- [ ] Login works with test credentials
- [ ] Ready to connect frontend!

---

## 🎉 You're Ready!

Your backend is now running at: **http://localhost:5000**

**What you have:**
- ✅ Full RESTful API
- ✅ JWT Authentication
- ✅ Role-based Access Control
- ✅ MongoDB Database
- ✅ Sample Data (10 items, 3 users)
- ✅ Comprehensive Logging
- ✅ Complete Documentation

**Next:** Connect your React frontend and start building!

---

**Questions?** Check the documentation files or review the code comments.

**Happy Coding! 🚀**
