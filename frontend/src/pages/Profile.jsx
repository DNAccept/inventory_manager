import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, updateProfile, logout } = useInventory();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    useEffect(() => {
        if (user) {
            setUsername(user.username || '');
            setFullName(user.fullName || '');
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updates = { username, fullName };

        if (newPassword) {
            if (newPassword !== confirmNewPassword) {
                alert("New passwords do not match!");
                return;
            }
            if (!currentPassword) {
                alert("Current password is required to set a new password.");
                return;
            }
            updates.currentPassword = currentPassword;
            updates.newPassword = newPassword;
        }

        const success = await updateProfile(updates);
        if (success) {
            // Clear password fields on success
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            alert('Profile updated successfully!');
        }
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

                        <div style={{ borderTop: '1px solid #eee', margin: '20px 0', paddingTop: '20px' }}>
                            <h4>Change Password</h4>
                            <div className="form-group">
                                <label>Current Password (required to change)</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                />
                            </div>
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
