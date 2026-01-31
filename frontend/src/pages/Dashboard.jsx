import React, { useState, useRef, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ReasonModal from '../components/ReasonModal';

const Dashboard = () => {
    const { user, items, deleteItem } = useInventory();
    const navigate = useNavigate();

    // Calculate current stats
    const totalItems = items.length;
    const totalQuantity = items.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0);
    const totalValue = items.reduce((sum, item) => sum + (parseFloat(item.price || 0) * parseInt(item.quantity || 0)), 0);

    // Track trends
    // Initialize state from localStorage if available
    const [trends, setTrends] = useState(() => {
        const saved = localStorage.getItem('inventoryTrends');
        return saved ? JSON.parse(saved) : {
            items: 'neutral',
            quantity: 'neutral',
            value: 'neutral'
        };
    });

    // Re-doing the ref initialization properly:
    const getSavedStats = () => {
        const saved = localStorage.getItem('inventoryPrevStats');
        return saved ? JSON.parse(saved) : null;
    };

    const statsRef = useRef(getSavedStats());

    useEffect(() => {
        // Handle first run / initialization
        if (!statsRef.current) {
            // No saved stats, initialize with current values
            statsRef.current = { items: totalItems, quantity: totalQuantity, value: totalValue };
            // Use default neutral trends
            localStorage.setItem('inventoryPrevStats', JSON.stringify(statsRef.current));
            localStorage.setItem('inventoryTrends', JSON.stringify(trends));
            return;
        }

        const currentStats = { items: totalItems, quantity: totalQuantity, value: totalValue };
        const prev = statsRef.current;

        // Check for changes
        const statsChanged =
            totalItems !== prev.items ||
            totalQuantity !== prev.quantity ||
            Math.abs(totalValue - prev.value) > 0.01;

        if (statsChanged) {
            const newTrends = {
                items: totalItems > prev.items ? 'increase' : totalItems < prev.items ? 'decrease' : trends.items,
                quantity: totalQuantity > prev.quantity ? 'increase' : totalQuantity < prev.quantity ? 'decrease' : trends.quantity,
                value: totalValue > prev.value ? 'increase' : totalValue < prev.value ? 'decrease' : trends.value
            };

            // If values are equal, keep the OLD trend (don't set to neutral).
            // Logic above: if totalItems > prev, increase. If < prev, decrease. 
            // BUT if totalItems === prev, we mistakenly might want 'neutral'?
            // No, user wants persistence. If it hasn't changed *in this update*, we shouldn't change the trend color?
            // Wait, if statsChanged is true, at least ONE changed. 
            // But others might not have.
            // Example: quantity changed, items didn't.
            // Items: 10 -> 10. Prev: 10.
            // 10 > 10? False. 10 < 10? False. 
            // So we should fallback to `trends.items` (keep existing color).

            setTrends(newTrends);
            statsRef.current = currentStats;

            // Save to localStorage
            localStorage.setItem('inventoryPrevStats', JSON.stringify(currentStats));
            localStorage.setItem('inventoryTrends', JSON.stringify(newTrends));
        }
    }, [items, totalItems, totalQuantity, totalValue, trends]);

    const [showReasonModal, setShowReasonModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const initiateDelete = (id) => {
        setItemToDelete(id);
        setShowReasonModal(true);
    };

    const confirmDelete = (reason) => {
        if (itemToDelete) {
            deleteItem(itemToDelete, reason);
            setItemToDelete(null);
        }
        setShowReasonModal(false);
    };

    return (
        <div className="dashboard-layout">
            <Navbar />
            <main className="dashboard-content">
                <div className="dashboard-header">
                    <h1>Inventory Dashboard</h1>
                    {user && user.role !== 'viewer' && (
                        <Link to="/inventory/add" className="btn btn-primary">Add New Item</Link>
                    )}
                </div>

                <div className="stats-grid">
                    <div className={`stat-card ${trends.items}`}>
                        <h3>Total Items</h3>
                        <div className="stat-value">{totalItems}</div>
                    </div>
                    <div className={`stat-card ${trends.quantity}`}>
                        <h3>Total Quantity</h3>
                        <div className="stat-value">{totalQuantity}</div>
                    </div>
                    <div className={`stat-card ${trends.value}`}>
                        <h3>Total Value</h3>
                        <div className="stat-value">GH₵{totalValue.toFixed(2)}</div>
                    </div>
                </div>

                <div className="inventory-list">
                    <h2>Inventory Items</h2>
                    {items.length === 0 ? (
                        <p className="no-items">No items found. Add some!</p>
                    ) : (
                        <table className="inventory-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.category}</td>
                                        <td>
                                            <span className={`badge ${item.quantity < 10 ? 'badge-low' : 'badge-ok'}`}>
                                                {item.quantity}
                                            </span>
                                        </td>
                                        <td>GH₵{parseFloat(item.price).toFixed(2)}</td>
                                        <td className="actions-cell">
                                            {user && user.role !== 'viewer' && (
                                                <>
                                                    <Link to={`/inventory/edit/${item.id}`} className="btn btn-small btn-secondary">Edit</Link>
                                                    <button onClick={() => initiateDelete(item.id)} className="btn btn-small btn-danger">Delete</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>

            <ReasonModal
                isOpen={showReasonModal}
                onClose={() => setShowReasonModal(false)}
                onConfirm={confirmDelete}
                actionType="DELETE"
            />
        </div>
    );
};

export default Dashboard;
