import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ReasonModal from '../components/ReasonModal';

const Dashboard = () => {
    const { items, deleteItem } = useInventory();
    const navigate = useNavigate();

    const totalProducts = items.reduce((acc, item) => acc + parseInt(item.quantity), 0);
    const totalValue = items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);

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
                    {user.role !== 'viewer' && (
                        <Link to="/inventory/add" className="btn btn-primary">Add New Item</Link>
                    )}
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Items</h3>
                        <div className="stat-value">{items.length}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Total Quantity</h3>
                        <div className="stat-value">{totalProducts}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Total Value</h3>
                        <div className="stat-value">${totalValue}</div>
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
                                        <td>${parseFloat(item.price).toFixed(2)}</td>
                                        <td className="actions-cell">
                                            {user.role !== 'viewer' && (
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
