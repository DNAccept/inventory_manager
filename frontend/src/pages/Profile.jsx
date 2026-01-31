import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, updateProfile, logout } = useInventory();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');

    useEffect(() => {
        if (user) {
            setUsername(user.username || '');
            setFullName(user.fullName || '');
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile({ username, fullName });
    };

    return (
        <div className="login-container" style={{ position: 'relative' }}>
            <button
                onClick={() => navigate('/dashboard')}
                className="btn-icon"
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                }}
                title="Back to Dashboard"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
            </button>

            <div className="form-container">
                <div className="form-card">
                    <h2>Manage Profile</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter full name"
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">Update Profile</button>
                            <button type="button" onClick={logout} className="btn btn-danger">Logout</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
