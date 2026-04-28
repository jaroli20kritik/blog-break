import { API_BASE } from '../../config';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout';

const AdminTablesPage = () => {
    const { token } = useAuth();
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const headers = { Authorization: `Bearer ${token}` };

    const fetchTables = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/Table/status`, { headers });
            setTables(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchTables();
        const interval = setInterval(fetchTables, 10000);
        return () => clearInterval(interval);
    }, []);

    const resetTable = async (tableId, tableNumber) => {
        if (!window.confirm(`Reset Table ${tableNumber}? This will clear the session.`)) return;
        try {
            await axios.post(`${API_BASE}/api/Table/reset/${tableId}`, {}, { headers });
            fetchTables();
        } catch (err) { console.error(err); }
    };

    if (loading) return (
        <AdminLayout><div className="admin-loading"><div className="spinner"></div></div></AdminLayout>
    );

    const occupied = tables.filter(t => t.status === 'Occupied').length;

    return (
        <AdminLayout>
            <div className="admin-page">
                <div className="admin-page-header">
                    <h1>Tables</h1>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.9rem' }}>
                        <span>🟢 Available: {tables.length - occupied}</span>
                        <span>🔴 Occupied: {occupied}</span>
                    </div>
                </div>

                <div className="tables-grid">
                    {tables.map(table => (
                        <div key={table.id} className={`table-card ${table.status === 'Occupied' ? 'table-occupied' : 'table-available'}`}>
                            <div className="table-number">Table {table.tableNumber}</div>
                            <div className={`table-status-dot ${table.status === 'Occupied' ? 'occupied' : 'available'}`}></div>
                            <div className="table-status-text">{table.status}</div>
                            {table.status === 'Occupied' && (
                                <div className="table-info">
                                    <div className="table-info-row">
                                        <span>Active Orders</span>
                                        <strong>{table.activeOrders}</strong>
                                    </div>
                                    <div className="table-info-row">
                                        <span>Service Status</span>
                                        <span 
                                            className={table.serviceStatus !== 'Empty' ? 'blink-text' : ''}
                                            style={{ 
                                                color: table.serviceStatus === 'Pending' ? '#ff4757' : (table.serviceStatus === 'Preparing' ? '#3498db' : (table.serviceStatus === 'Served' ? '#2ecc71' : 'var(--text-muted)')),
                                                fontWeight: '700',
                                                fontSize: '0.95rem'
                                            }}
                                        >
                                            {table.serviceStatus}
                                        </span>
                                    </div>
                                    {table.totalAmount > 0 && (
                                        <div className="table-info-row">
                                            <span>Running Total</span>
                                            <strong>₹{table.totalAmount}</strong>
                                        </div>
                                    )}
                                    <button className="btn-reset-table" onClick={() => resetTable(table.id, table.tableNumber)}>
                                        Reset Table
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminTablesPage;
