# Deployment Guide - Inventory Management System Backend

This guide covers deploying the backend API to various cloud platforms.

---

## Table of Contents
1. [MongoDB Atlas Setup](#mongodb-atlas-setup)
2. [Heroku Deployment](#heroku-deployment)
3. [Railway Deployment](#railway-deployment)
4. [Render Deployment](#render-deployment)
5. [Environment Variables](#environment-variables)
6. [Post-Deployment](#post-deployment)
7. [Troubleshooting](#troubleshooting)

---

## MongoDB Atlas Setup

Before deploying, set up a cloud MongoDB database:

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new project

### Step 2: Create Cluster
1. Click "Build a Database"
2. Choose "Free Shared" tier
3. Select your preferred cloud provider and region
4. Click "Create Cluster" (takes 3-5 minutes)

### Step 3: Configure Database Access
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Create a username and password (save these!)
4. Select "Read and write to any database"
5. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, use specific IPs instead
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `inventory_management`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/inventory_management?retryWrites=true&w=majority
```

---

## Heroku Deployment

### Prerequisites
- Heroku account
- Heroku CLI installed
- Git initialized in your project

### Step 1: Install Heroku CLI
```bash
# macOS
brew install heroku/brew/heroku

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

### Step 2: Login to Heroku
```bash
heroku login
```

### Step 3: Create Heroku App
```bash
cd backend
heroku create your-app-name-backend
```

### Step 4: Set Environment Variables
```bash
heroku config:set MONGODB_URI="your_mongodb_atlas_connection_string"
heroku config:set JWT_SECRET="your_random_secret_key_here"
heroku config:set JWT_EXPIRE="7d"
heroku config:set NODE_ENV="production"
heroku config:set CORS_ORIGIN="your_frontend_url"
```

### Step 5: Create Procfile
Create a file named `Procfile` in backend root:
```
web: node server.js
```

### Step 6: Deploy
```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main
```

### Step 7: Seed Database (Optional)
```bash
heroku run npm run seed
```

### Step 8: View Logs
```bash
heroku logs --tail
```

### Step 9: Open App
```bash
heroku open
```

Your API will be available at: `https://your-app-name-backend.herokuapp.com`

---

## Railway Deployment

### Step 1: Create Railway Account
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub

### Step 2: New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Select the backend directory if in monorepo

### Step 3: Configure Environment Variables
1. Go to "Variables" tab
2. Add the following:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_random_secret_key_here
   JWT_EXPIRE=7d
   NODE_ENV=production
   PORT=5000
   CORS_ORIGIN=your_frontend_url
   ```

### Step 4: Configure Build
1. Go to "Settings" tab
2. Set Root Directory to `/backend` (if in monorepo)
3. Set Build Command: `npm install`
4. Set Start Command: `npm start`

### Step 5: Deploy
Railway will automatically deploy on push to main branch.

### Step 6: Get Deployment URL
1. Go to "Settings" tab
2. Find "Domains" section
3. Click "Generate Domain"
4. Copy the URL

---

## Render Deployment

### Step 1: Create Render Account
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub

### Step 2: New Web Service
1. Click "New +"
2. Select "Web Service"
3. Connect your GitHub repository

### Step 3: Configure Service
```
Name: inventory-backend
Environment: Node
Region: Choose closest to your users
Branch: main
Root Directory: backend (if in monorepo)
Build Command: npm install
Start Command: npm start
```

### Step 4: Select Plan
- Choose "Free" tier for testing
- Or "Starter" ($7/month) for production

### Step 5: Add Environment Variables
```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=production
PORT=5000
CORS_ORIGIN=your_frontend_url
```

### Step 6: Create Web Service
Click "Create Web Service" - deployment will start automatically.

### Step 7: Get Service URL
Once deployed, your URL will be shown at the top of the dashboard.

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection string | mongodb+srv://user:pass@cluster.mongodb.net/dbname |
| JWT_SECRET | Secret key for JWT signing | Use a random 32+ character string |
| JWT_EXPIRE | Token expiration time | 7d |
| NODE_ENV | Environment mode | production |
| PORT | Server port | 5000 |
| CORS_ORIGIN | Frontend URL | https://your-frontend.com |

### Generate Secure JWT Secret

**Option 1: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Option 2: Using OpenSSL**
```bash
openssl rand -hex 64
```

**Option 3: Online Generator**
Go to [RandomKeygen.com](https://randomkeygen.com/) and use a Fort Knox Password.

---

## Post-Deployment

### 1. Test Health Endpoint
```bash
curl https://your-api-url.com/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-01-30T12:00:00.000Z"
}
```

### 2. Seed Database
If deploying for the first time:

**Heroku:**
```bash
heroku run npm run seed
```

**Railway/Render:**
Use the platform's console or SSH feature to run:
```bash
npm run seed
```

### 3. Test Authentication
```bash
curl -X POST https://your-api-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 4. Update Frontend
Update your frontend's API URL to point to the deployed backend:
```javascript
// In frontend config or .env
VITE_API_URL=https://your-api-url.com
```

### 5. Test Full Integration
- Login from frontend
- Perform CRUD operations
- Check logs functionality
- Test all user roles

---

## Troubleshooting

### Common Issues

#### 1. Application Error / Crash
**Check Logs:**
```bash
# Heroku
heroku logs --tail

# Railway
Click on deployment > View logs

# Render
Go to Logs tab
```

**Common Causes:**
- Missing environment variables
- MongoDB connection string incorrect
- Port configuration issues

#### 2. Cannot Connect to Database
**Check:**
- MongoDB Atlas IP whitelist (should include 0.0.0.0/0)
- Connection string format is correct
- Database user has correct permissions
- Password doesn't contain special characters (URL encode if needed)

#### 3. CORS Errors
**Solution:**
Update CORS_ORIGIN environment variable:
```bash
CORS_ORIGIN=https://your-frontend-domain.com
```

For multiple origins, modify server.js:
```javascript
const allowedOrigins = [
  'https://frontend1.com',
  'https://frontend2.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

#### 4. JWT Secret Not Set
**Error:** "JWT secret not defined"

**Solution:**
Make sure JWT_SECRET is set in environment variables.

#### 5. Build Failures
**Check:**
- Node version compatibility (use v16+)
- All dependencies in package.json
- No missing imports
- Correct start script in package.json

---

## Production Checklist

Before going live, ensure:

- [ ] MongoDB Atlas cluster is created and accessible
- [ ] All environment variables are set
- [ ] Strong JWT secret is generated
- [ ] Database is seeded with admin user
- [ ] Default admin password is changed
- [ ] CORS is configured for production domain
- [ ] Health check endpoint works
- [ ] All API endpoints are tested
- [ ] Frontend can connect to backend
- [ ] Logs are being recorded
- [ ] Error handling is working
- [ ] SSL/HTTPS is enabled (automatic on most platforms)

---

## Monitoring

### Heroku
```bash
# View metrics
heroku ps

# View logs
heroku logs --tail

# Restart dyno
heroku restart
```

### Railway
- Built-in metrics dashboard
- Real-time logs
- Auto-scaling options

### Render
- Built-in metrics
- Health check monitoring
- Auto-deploy on push

---

## Scaling

### Heroku
```bash
# Scale to 2 dynos
heroku ps:scale web=2

# Upgrade to hobby tier ($7/month)
heroku ps:type hobby
```

### Railway
- Adjust resources in Settings
- Auto-scaling available

### Render
- Upgrade plan for more resources
- Configure auto-scaling

---

## Backup Strategy

### Database Backups
MongoDB Atlas provides automatic backups:
1. Go to cluster settings
2. Enable "Backup"
3. Configure retention period

### Manual Backup
```bash
# Export database
mongodump --uri="your_mongodb_uri"

# Import database
mongorestore --uri="your_mongodb_uri" dump/
```

---

## Support

For deployment issues:
- Check platform documentation
- Review application logs
- Test locally first
- Verify environment variables
- Check MongoDB Atlas configuration

---

**Last Updated**: January 30, 2025
