import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { api } from '../services/api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Registration state
    const [isInitialized, setIsInitialized] = useState(true); // Default to true to prevent flash
    const [loadingInit, setLoadingInit] = useState(true);
    const [fullName, setFullName] = useState('');

    const [error, setError] = useState('');
    const { login } = useInventory();
    const navigate = useNavigate();

    useEffect(() => {
        const checkSystem = async () => {
            try {
                const data = await api.checkInit();
                setIsInitialized(data.initialized);
            } catch (err) {
                console.error("Failed to check init status:", err);
            } finally {
                setLoadingInit(false);
            }
        };
        checkSystem();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        const success = await login(username, password);
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Invalid credentials');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const data = await api.registerInitial({ username, password, fullName });
            if (data.success) {
                // Auto login after registration
                const success = await login(username, password);
                if (success) {
                    navigate('/dashboard');
                } else {
                    // Fallback if auto-login fails for some reason
                    setIsInitialized(true);
                    setError('Account created. Please log in.');
                }
            }
        } catch (err) {
            setError(err.message || 'Registration failed');
        }
    };

    if (loadingInit) {
        return <div className="login-container"><div className="login-card">Loading...</div></div>;
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>{isInitialized ? 'Welcome Back' : 'Setup Admin Account'}</h2>
                <p>{isInitialized ? 'Sign in to manage inventory' : 'Create the first administrator account to get started'}</p>

                <form onSubmit={isInitialized ? handleLogin : handleRegister}>
                    {!isInitialized && (
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter full name"
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    padding: '0',
                                    cursor: 'pointer',
                                    color: '#666',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="btn btn-primary btn-block">
                        {isInitialized ? 'Login' : 'Create Admin Account'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
