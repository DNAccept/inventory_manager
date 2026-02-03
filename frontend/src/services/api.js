import { useInventory } from '../context/InventoryContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('inventoryToken');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const api = {
    // Auth
    checkInit: async () => {
        const response = await fetch(`${API_URL}/auth/init`, {
            headers: { 'Content-Type': 'application/json' },
        });
        return handleResponse(response);
    },

    registerInitial: async (data) => {
        const response = await fetch(`${API_URL}/auth/init`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    register: async (data) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    login: async (credentials) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        return handleResponse(response);
    },

    getMe: async () => {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    updateProfile: async (data) => {
        const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    // Items
    getItems: async () => {
        const response = await fetch(`${API_URL}/items`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },

    createItem: async (data) => {
        const response = await fetch(`${API_URL}/items`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    updateItem: async (id, data) => {
        const response = await fetch(`${API_URL}/items/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    deleteItem: async (id, reason) => {
        const response = await fetch(`${API_URL}/items/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
            body: JSON.stringify({ reason }),
        });
        return handleResponse(response);
    },

    // Logs
    getLogs: async () => {
        const response = await fetch(`${API_URL}/logs`, {
            headers: getHeaders(),
        });
        return handleResponse(response);
    },
};

const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'API Error');
    }
    return data;
};
