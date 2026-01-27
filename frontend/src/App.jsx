import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InventoryForm from './pages/InventoryForm';
import { useInventory } from './context/InventoryContext';
import './App.css';

import Logs from './pages/Logs';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
  const { user } = useInventory();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/logs"
        element={
          <ProtectedRoute>
            <Logs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory/add"
        element={
          <ProtectedRoute>
            <InventoryForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory/edit/:id"
        element={
          <ProtectedRoute>
            <InventoryForm />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
