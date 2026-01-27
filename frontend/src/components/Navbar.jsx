import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';


const Navbar = () => {
    const { user, logout } = useInventory();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/dashboard">IMS</Link>
            </div>
            <div className="navbar-menu">
                <Link to="/dashboard" className="navbar-item">Dashboard</Link>
                <Link to="/logs" className="navbar-item">Logs</Link>
                <div className="navbar-end">
                    <span className="navbar-user">
                        Welcome, <Link to="/profile" style={{ color: 'inherit', textDecoration: 'underline' }}>{user.username}</Link>
                    </span>
                    <button onClick={handleLogout} className="btn btn-danger">Logout</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
