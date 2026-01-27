import React from 'react';
import { useInventory } from '../context/InventoryContext';
import Navbar from '../components/Navbar';

const Logs = () => {
    const { logs } = useInventory();

    return (
        <div className="dashboard-layout">
            <Navbar />
            <main className="dashboard-content">
                <div className="dashboard-header">
                    <h1>Action Logs</h1>
                </div>

                <div className="inventory-list">
                    {logs.length === 0 ? (
                        <p className="no-items">No actions recorded yet.</p>
                    ) : (
                        <table className="inventory-table">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>User</th>
                                    <th>Action</th>
                                    <th>Reason</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map(log => (
                                    <tr key={log.id}>
                                        <td>{log.timestamp}</td>
                                        <td>{log.user}</td>
                                        <td>
                                            <span className={`badge ${log.action === 'ADD' ? 'badge-ok' :
                                                log.action === 'DELETE' ? 'badge-low' : 'badge-ok'
                                                }`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td>{log.reason}</td>
                                        <td>{log.details}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Logs;
