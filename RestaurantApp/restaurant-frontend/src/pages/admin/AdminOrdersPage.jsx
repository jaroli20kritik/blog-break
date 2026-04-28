import { API_BASE } from '../../config';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout';
import { HubConnectionBuilder } from '@microsoft/signalr';

const statusColor = { 'Pending': '#f39c12', 'Preparing': '#3498db', 'Served': '#2ecc71', 'Paid': '#9b59b6', 'Completed': '#00bcd4' };
const statusFlow = ['Pending', 'Preparing', 'Served'];

const AdminOrdersPage = () => {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(1);
    const [newOrderIds, setNewOrderIds] = useState(new Set());
    const headers = { Authorization: `Bearer ${token}` };

    const fetchOrders = async () => {
        try {
            const params = new URLSearchParams({ page, pageSize: 20 });
            if (filter) params.append('status', filter);
            const res = await axios.get(`${API_BASE}/api/Order/all?${params}`, { headers });
            setOrders(res.data.orders);
            setTotal(res.data.total);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchOrders(); }, [filter, page]);

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl(`${API_BASE}/orderhub`)
            .withAutomaticReconnect()
            .build();

        connection.start().then(() => connection.invoke('JoinOwnerGroup').catch(console.error));
        connection.on('NewOrder', (orderId) => {
            setNewOrderIds(prev => new Set([...prev, orderId]));
            fetchOrders();
            setTimeout(() => setNewOrderIds(prev => { const n = new Set(prev); n.delete(orderId); return n; }), 5000);
        });
        connection.on('OrderUpdated', () => fetchOrders());

        return () => connection.stop();
    }, [token, filter, page]);

    const updateStatus = async (orderId, status) => {
        try {
            await axios.post(`${API_BASE}/api/Order/${orderId}/status`, JSON.stringify(status), {
                headers: { ...headers, 'Content-Type': 'application/json' }
            });
            fetchOrders();
        } catch (err) { console.error(err); }
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <div className="admin-page-header">
                    <h1>Orders <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '8px' }}>({total} total)</span></h1>
                    <div className="filter-tabs">
                        {['', 'Pending', 'Preparing', 'Served'].map(s => (
                            <button key={s} className={`filter-tab ${filter === s ? 'active' : ''}`} onClick={() => { setFilter(s); setPage(1); }}>
                                {s || 'All'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Table</th>
                                <th>Items</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Time</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className={newOrderIds.has(order.id) ? 'new-order-row' : ''}>
                                    <td><strong>#{order.id}</strong>{newOrderIds.has(order.id) && <span className="new-badge">NEW</span>}</td>
                                    <td>Table {order.table?.tableNumber}</td>
                                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {order.items?.map(i => `${i.menuItem?.name} x${i.quantity}`).join(', ')}
                                    </td>
                                    <td><strong>₹{order.totalAmount}</strong></td>
                                    <td>
                                        <span className="status-badge" style={{ 
                                            background: order.isServed ? '#2ecc71' : (order.isPrepared ? '#3498db' : '#f39c12')
                                        }}>
                                            {order.isServed ? 'Served' : (order.isPrepared ? 'Preparing' : 'Pending')}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {new Date(order.createdAt).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                                    </td>
                                    <td>
                                        <div className="action-btns">
                                            {!order.isPrepared && (
                                                <button className="action-btn action-btn-preparing" onClick={() => updateStatus(order.id, 'Preparing')}>
                                                    → Preparing
                                                </button>
                                            )}
                                            {order.isPrepared && !order.isServed && (
                                                <button className="action-btn action-btn-served" onClick={() => updateStatus(order.id, 'Served')}>
                                                    → Served
                                                </button>
                                            )}
                                            {order.isServed && (
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Ready to Pay / Done</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {orders.length === 0 && <div className="empty-state">No orders found.</div>}
                </div>

                {total > 20 && (
                    <div className="pagination">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                        <span>Page {page}</span>
                        <button disabled={orders.length < 20} onClick={() => setPage(p => p + 1)}>Next →</button>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminOrdersPage;
