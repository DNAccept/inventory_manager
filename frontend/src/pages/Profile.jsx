import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, updateProfile } = useInventory();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        fullName: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                fullName: user.fullName || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile(formData);
    };

    return (
        <div className="form-layout">
            <Navbar />
            <div className="form-container">
                <div className="form-card">
                    <h1>Manage Profile</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter full name"
                            />
                        </div>
                        <div className="form-actions">
                            <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary">Back to Dashboard</button>
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
