import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [logs, setLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('inventoryToken');
        if (token) {
          const userData = await api.getMe();
          setUser(userData.user);
          await fetchInventoryData();
        }
      } catch (error) {
        console.error("Session restore failed:", error);
        localStorage.removeItem('inventoryToken');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading application data...</div>;
  }

  const fetchInventoryData = async () => {
    try {
      const itemsData = await api.getItems();
      setItems(itemsData.items);

      const logsData = await api.getLogs();
      setLogs(logsData.logs);
    } catch (error) {
      console.error("Failed to fetch inventory data:", error);
    }
  };

  const login = async (username, password) => {
    try {
      const data = await api.login({ username, password });
      localStorage.setItem('inventoryToken', data.token);
      setUser(data.user);
      await fetchInventoryData();
      return true;
    } catch (error) {
      alert(error.message);
      return false;
    }
  };

  const updateProfile = async (newDetails) => {
    try {
      const data = await api.updateProfile(newDetails);
      setUser(data.user);
      return true;
    } catch (error) {
      alert(error.message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setItems([]);
    setLogs([]);
    localStorage.removeItem('inventoryToken');
  };

  /* Inventory Actions */
  const addItem = async (newItem, reason) => {
    try {
      await api.createItem({ ...newItem, reason });
      await fetchInventoryData(); // Refresh data
    } catch (error) {
      alert(error.message);
    }
  };

  const updateItem = async (id, updatedItem, reason) => {
    try {
      await api.updateItem(id, { ...updatedItem, reason });
      await fetchInventoryData(); // Refresh data
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteItem = async (id, reason) => {
    try {
      await api.deleteItem(id, reason);
      await fetchInventoryData(); // Refresh data
    } catch (error) {
      alert(error.message);
    }
  };

  // Mock functions for admin user management (not implemented in API yet or reserved for site_admin)
  const addUser = (newUser) => { console.log("Add user not implemented via API yet"); };
  const removeUser = (userId) => { console.log("Remove user not implemented via API yet"); };
  const updateUserRole = (userId, newRole) => { console.log("Update role not implemented via API yet"); };

  return (
    <InventoryContext.Provider value={{
      user, items, logs, notifications,
      login, logout, addItem, updateItem, deleteItem, updateProfile,
      addUser, removeUser, updateUserRole
    }}>
      {children}
    </InventoryContext.Provider>
  );
};
