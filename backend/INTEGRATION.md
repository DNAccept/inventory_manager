# Frontend-Backend Integration Guide

This guide explains how to connect the React frontend with the Node.js/Express backend for the Inventory Management System.

---

## Overview

The frontend communicates with the backend through RESTful API calls. This guide covers:
1. Setting up the API configuration
2. Making authenticated requests
3. Handling responses and errors
4. Testing the integration

---

## Step 1: Backend Setup

First, ensure your backend is running:

```bash
cd backend
npm install
npm run seed
npm run dev
```

Backend should be running at: **http://localhost:5000**

---

## Step 2: Frontend API Configuration

### Create API Configuration File

Create `src/api/config.js` in your frontend:

```javascript
// src/api/config.js
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  UPDATE_PROFILE: '/auth/profile',
  
  // Items
  ITEMS: '/items',
  ITEM: (id) => `/items/${id}`,
  ITEMS_STATS: '/items/stats',
  
  // Users (Admin)
  USERS: '/users',
  USER: (id) => `/users/${id}`,
  
  // Logs
  LOGS: '/logs',
  LOGS_RECENT: '/logs/recent',
  LOGS_ACTION: (action) => `/logs/action/${action}`,
  LOGS_USER: (userId) => `/logs/user/${userId}`,
};
```

### Create Environment File

Create `.env` in frontend root:

```env
VITE_API_URL=http://localhost:5000/api
```

For production:
```env
VITE_API_URL=https://your-backend-url.com/api
```

---

## Step 3: Create API Service

### Create API Client

Create `src/api/apiClient.js`:

```javascript
// src/api/apiClient.js
import { API_BASE_URL } from './config';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // PUT request
  async put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // DELETE request
  async delete(endpoint, body = null) {
    return this.request(endpoint, {
      method: 'DELETE',
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

export default new ApiClient();
```

---

## Step 4: Create API Services

### Authentication Service

Create `src/api/authService.js`:

```javascript
// src/api/authService.js
import apiClient from './apiClient';
import { API_ENDPOINTS } from './config';

export const authService = {
  async login(username, password) {
    const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
      username,
      password,
    });
    
    if (response.success && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  async logout() {
    try {
      await apiClient.post(API_ENDPOINTS.LOGOUT);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  async getProfile() {
    return apiClient.get(API_ENDPOINTS.ME);
  },

  async updateProfile(data) {
    return apiClient.put(API_ENDPOINTS.UPDATE_PROFILE, data);
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
```

### Items Service

Create `src/api/itemsService.js`:

```javascript
// src/api/itemsService.js
import apiClient from './apiClient';
import { API_ENDPOINTS } from './config';

export const itemsService = {
  async getAll() {
    return apiClient.get(API_ENDPOINTS.ITEMS);
  },

  async getOne(id) {
    return apiClient.get(API_ENDPOINTS.ITEM(id));
  },

  async create(itemData) {
    return apiClient.post(API_ENDPOINTS.ITEMS, itemData);
  },

  async update(id, itemData) {
    return apiClient.put(API_ENDPOINTS.ITEM(id), itemData);
  },

  async delete(id, reason) {
    return apiClient.delete(API_ENDPOINTS.ITEM(id), { reason });
  },

  async getStats() {
    return apiClient.get(API_ENDPOINTS.ITEMS_STATS);
  },
};
```

### Users Service

Create `src/api/usersService.js`:

```javascript
// src/api/usersService.js
import apiClient from './apiClient';
import { API_ENDPOINTS } from './config';

export const usersService = {
  async getAll() {
    return apiClient.get(API_ENDPOINTS.USERS);
  },

  async create(userData) {
    return apiClient.post(API_ENDPOINTS.USERS, userData);
  },

  async updateRole(id, role) {
    return apiClient.put(API_ENDPOINTS.USER(id), { role });
  },

  async delete(id) {
    return apiClient.delete(API_ENDPOINTS.USER(id));
  },
};
```

### Logs Service

Create `src/api/logsService.js`:

```javascript
// src/api/logsService.js
import apiClient from './apiClient';
import { API_ENDPOINTS } from './config';

export const logsService = {
  async getAll(page = 1, limit = 50) {
    return apiClient.get(`${API_ENDPOINTS.LOGS}?page=${page}&limit=${limit}`);
  },

  async getRecent() {
    return apiClient.get(API_ENDPOINTS.LOGS_RECENT);
  },

  async getByAction(action) {
    return apiClient.get(API_ENDPOINTS.LOGS_ACTION(action));
  },

  async getUserLogs(userId) {
    return apiClient.get(API_ENDPOINTS.LOGS_USER(userId));
  },
};
```

---

## Step 5: Update Context to Use API

Update `src/context/InventoryContext.jsx`:

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/authService';
import { itemsService } from '../api/itemsService';
import { logsService } from '../api/logsService';
import { usersService } from '../api/usersService';

const InventoryContext = createContext();

export function useInventory() {
  return useContext(InventoryContext);
}

export function InventoryProvider({ children }) {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize user from localStorage
  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        loadItems(),
        loadLogs(),
        loadStats(),
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Auth functions
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(username, password);
      setUser(response.user);
      await loadData();
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setItems([]);
      setLogs([]);
      setStats(null);
    }
  };

  const updateProfile = async (data) => {
    try {
      setLoading(true);
      const response = await authService.updateProfile(data);
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Items functions
  const loadItems = async () => {
    try {
      const response = await itemsService.getAll();
      setItems(response.items || []);
    } catch (error) {
      console.error('Error loading items:', error);
      throw error;
    }
  };

  const addItem = async (itemData) => {
    try {
      setLoading(true);
      const response = await itemsService.create(itemData);
      await loadItems();
      await loadLogs();
      await loadStats();
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id, itemData) => {
    try {
      setLoading(true);
      const response = await itemsService.update(id, itemData);
      await loadItems();
      await loadLogs();
      await loadStats();
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id, reason) => {
    try {
      setLoading(true);
      const response = await itemsService.delete(id, reason);
      await loadItems();
      await loadLogs();
      await loadStats();
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logs functions
  const loadLogs = async () => {
    try {
      const response = await logsService.getAll();
      setLogs(response.logs || []);
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  // Stats functions
  const loadStats = async () => {
    try {
      const response = await itemsService.getStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const value = {
    user,
    items,
    logs,
    stats,
    loading,
    error,
    login,
    logout,
    updateProfile,
    addItem,
    updateItem,
    deleteItem,
    loadItems,
    loadLogs,
    loadStats,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}
```

---

## Step 6: Testing the Integration

### Test Checklist

1. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Login**
   - Navigate to http://localhost:5173
   - Login with: `admin` / `admin123`
   - Verify redirect to dashboard

4. **Test Dashboard**
   - Check stats are loaded
   - Verify items table shows data
   - Confirm data matches backend

5. **Test CRUD Operations**
   - Add new item
   - Edit existing item
   - Delete item
   - Verify changes persist

6. **Test Logs**
   - Navigate to logs page
   - Verify activities are recorded
   - Check timestamps and details

7. **Test Profile Update**
   - Update profile information
   - Change password
   - Verify changes saved

---

## Common Integration Issues

### 1. CORS Errors

**Problem:** Browser shows CORS policy error

**Solution:**
```javascript
// In backend server.js, ensure CORS is configured:
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### 2. 401 Unauthorized

**Problem:** API returns 401 for authenticated requests

**Solutions:**
- Check token is saved in localStorage
- Verify Authorization header format: `Bearer <token>`
- Check token hasn't expired
- Ensure JWT_SECRET matches between requests

### 3. Network Error

**Problem:** Cannot connect to backend

**Solutions:**
- Verify backend is running
- Check backend URL in `.env`
- Ensure correct port (5000 vs 5173)
- Check firewall settings

### 4. Data Not Loading

**Problem:** Dashboard shows no data

**Solutions:**
- Check backend is seeded: `npm run seed`
- Verify API endpoints return data
- Check browser console for errors
- Inspect network tab for failed requests

---

## Environment Variables Summary

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventory_management
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Production Deployment

### Backend
1. Deploy to Heroku/Railway/Render
2. Set environment variables
3. Note the deployed URL

### Frontend
1. Update `.env.production`:
   ```env
   VITE_API_URL=https://your-backend.herokuapp.com/api
   ```
2. Build: `npm run build`
3. Deploy to Vercel/Netlify/Render

### Update CORS
In backend, update CORS_ORIGIN to production frontend URL:
```env
CORS_ORIGIN=https://your-frontend.vercel.app
```

---

## API Response Handling

### Success Response
```javascript
{
  success: true,
  message: "Operation successful",
  data: { ... }
}
```

### Error Response
```javascript
{
  success: false,
  message: "Error message",
  errors: [ ... ]
}
```

### Example Error Handling
```javascript
try {
  const response = await itemsService.create(itemData);
  console.log('Success:', response.message);
} catch (error) {
  console.error('Error:', error.message);
  // Show user-friendly error
  alert(`Failed: ${error.message}`);
}
```

---

## Security Best Practices

1. **Never commit secrets**
   - Add `.env` to `.gitignore`
   - Use environment variables
   - Rotate secrets regularly

2. **Token Security**
   - Store in localStorage (or httpOnly cookies for better security)
   - Clear on logout
   - Handle token expiration

3. **Input Validation**
   - Validate on both frontend and backend
   - Sanitize user inputs
   - Use proper data types

4. **HTTPS in Production**
   - Always use HTTPS
   - Enable CORS only for trusted origins
   - Use strong JWT secrets

---

## Debugging Tips

1. **Backend Logs**
   ```bash
   # Watch backend logs
   npm run dev
   ```

2. **Browser DevTools**
   - Network tab: See all API requests
   - Console: Check for errors
   - Application: Inspect localStorage

3. **Test with cURL**
   ```bash
   # Test login
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```

4. **MongoDB Shell**
   ```bash
   mongosh
   use inventory_management
   db.items.find().pretty()
   ```

---

## Next Steps

1. Complete frontend implementation
2. Test all user roles (admin, editor, viewer)
3. Add error handling and loading states
4. Implement form validations
5. Add confirmation dialogs
6. Enhance UI/UX
7. Deploy to production

---

**Integration Complete!** 🎉

Your frontend should now be successfully communicating with your backend API.

---

**Last Updated**: January 30, 2025
