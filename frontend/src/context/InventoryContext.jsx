import React, { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([
    { id: 1, name: 'Laptop', category: 'Electronics', quantity: 15, price: 999.99, description: 'High-performance laptop' },
    { id: 2, name: 'Desk Chair', category: 'Furniture', quantity: 50, price: 149.50, description: 'Ergonomic office chair' },
    { id: 3, name: 'Wireless Mouse', category: 'Electronics', quantity: 100, price: 29.99, description: 'Bluetooth mouse' },
  ]);

  // Mock Database of Users
  const [dbUsers, setDbUsers] = useState([
    { id: 1, username: 'admin', password: 'admin123', role: 'site_admin', fullName: 'Site Administrator' },
    { id: 2, username: 'editor', password: 'password', role: 'editor', fullName: 'Inventory Editor' },
    { id: 3, username: 'viewer', password: 'password', role: 'viewer', fullName: 'ReadOnly Viewer' }
  ]);
  const [notifications, setNotifications] = useState([]);

  // Simulate persistent auth
  useEffect(() => {
    const storedUser = localStorage.getItem('inventoryUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username, password) => {
    const dbUser = dbUsers.find(u => u.username === username && u.password === password);
    if (dbUser) {
      const { password, ...safeUser } = dbUser; // Exclude password from session
      setUser(safeUser);
      localStorage.setItem('inventoryUser', JSON.stringify(safeUser));
      return true;
    }
    return false;
  };

  const updateProfile = (newDetails) => {
    // Check uniqueness if username is changing
    if (newDetails.username && newDetails.username !== user.username) {
      const exists = dbUsers.some(u => u.username === newDetails.username && u.username !== user.username);
      if (exists) {
        alert("Username already taken!");
        return false;
      }
      // Notify Admin
      const notification = {
        id: Date.now(),
        message: `User '${user.username}' changed username to '${newDetails.username}'`,
        timestamp: new Date().toLocaleString()
      };
      setNotifications(prev => [notification, ...prev]);
    }

    // Update current user
    const updatedUser = { ...user, ...newDetails };
    setUser(updatedUser);
    localStorage.setItem('inventoryUser', JSON.stringify(updatedUser));

    // Update "DB"
    setDbUsers(prev => prev.map(u => u.username === user.username ? { ...u, ...newDetails } : u));

    return true;
  };

  /* Admin User Management */
  const addUser = (newUser) => {
    const exists = dbUsers.some(u => u.username === newUser.username);
    if (exists) return false;

    const userWithId = { ...newUser, id: Date.now() };
    setDbUsers(prev => [...prev, userWithId]);
    return true;
  };

  const removeUser = (userId) => {
    setDbUsers(prev => prev.filter(u => u.id !== userId));
  };

  const updateUserRole = (userId, newRole) => {
    setDbUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('inventoryUser');
  };

  /* Logs State */
  const [logs, setLogs] = useState([]);

  const logAction = (action, details, reason) => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      user: user ? user.username : 'Unknown',
      action,
      details,
      reason: reason || 'N/A'
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const addItem = (newItem, reason) => {
    setItems(prev => [...prev, { ...newItem, id: Date.now() }]);
    logAction('ADD', `Added item: ${newItem.name}`, reason);
  };

  const updateItem = (id, updatedItem, reason) => {
    setItems(prev => prev.map(item => item.id === id ? { ...updatedItem, id } : item));
    logAction('UPDATE', `Updated item ID: ${id}`, reason);
  };

  const deleteItem = (id, reason) => {
    const item = items.find(i => i.id === id);
    setItems(prev => prev.filter(item => item.id !== id));
    logAction('DELETE', `Deleted item: ${item ? item.name : id}`, reason);
  };

  return (
    <InventoryContext.Provider value={{
      user, items, logs, notifications, dbUsers,
      login, logout, addItem, updateItem, deleteItem, updateProfile,
      addUser, removeUser, updateUserRole
    }}>
      {children}
    </InventoryContext.Provider>
  );
};
