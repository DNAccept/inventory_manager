import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import Navbar from '../components/Navbar';
import ReasonModal from '../components/ReasonModal';

const InventoryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { items, addItem, updateItem } = useInventory();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        quantity: '',
        price: '',
        description: ''
    });

    useEffect(() => {
        if (isEditMode) {
            const itemToEdit = items.find(item => item.id === parseInt(id));
            if (itemToEdit) {
                setFormData(itemToEdit);
            } else {
                navigate('/dashboard');
            }
        }
    }, [id, isEditMode, items, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const [showReasonModal, setShowReasonModal] = useState(false);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setShowReasonModal(true);
    };

    const confirmAction = (reason) => {
        const itemData = {
            ...formData,
            quantity: parseInt(formData.quantity),
            price: parseFloat(formData.price)
        };

        if (isEditMode) {
            updateItem(parseInt(id), itemData, reason);
        } else {
            addItem(itemData, reason);
        }
        setShowReasonModal(false);
        navigate('/dashboard');
    };

    return (
        <div className="form-layout">
            <Navbar />
            <div className="form-container">
                <div className="form-card">
                    <h1>{isEditMode ? 'Edit Item' : 'Add New Item'}</h1>
                    <form onSubmit={handleFormSubmit}>
                        <div className="form-group">
                            <label>Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                            />
                        </div>
                        <div className="form-actions">
                            <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary">Cancel</button>
                            <button type="submit" className="btn btn-primary">{isEditMode ? 'Update Item' : 'Add Item'}</button>
                        </div>
                    </form>
                </div>
            </div>

            <ReasonModal
                isOpen={showReasonModal}
                onClose={() => setShowReasonModal(false)}
                onConfirm={confirmAction}
                actionType={isEditMode ? 'UPDATE' : 'ADD'}
            />
        </div>
    );
};

export default InventoryForm;
