import { API_BASE } from '../../config';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout';

const KitchenPage = () => {
    const [orders, setOrders] = useState([]);
    const [activeOrder, setActiveOrder] = useState(null);

    const { token } = useAuth();
    const headers = { Authorization: `Bearer ${token}` };

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/Order/kitchen`, { headers });
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchOrders();

        const connection = new HubConnectionBuilder()
            .withUrl("${API_BASE}/orderhub")
            .withAutomaticReconnect()
            .build();

        connection.on("NewOrder", () => fetchOrders());
        connection.on("OrderUpdated", () => fetchOrders());

        connection.start()
            .then(() => connection.invoke("JoinOwnerGroup"))
            .catch(err => console.error("SignalR Connection Error: ", err));

        return () => {
            connection.stop();
        };
    }, []);

    const updateStatus = async (orderId, status) => {
        try {
            await axios.post(`${API_BASE}/api/Order/${orderId}/status`, `"${status}"`, {
                headers: { 
                    'Content-Type': 'application/json',
                    ...headers 
                }
            });
            fetchOrders();
            setActiveOrder(null); // Close modal on success
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <div className="admin-page-header">
                    <h1>Kitchen Dashboard</h1>
                    <div className="live-indicator">
                        <span className="dot pulse"></span> LIVE
                    </div>
                </div>

                <div className="orders-grid">
                    {orders.length === 0 ? (
                        <div className="no-data-card">No pending orders to cook.</div>
                    ) : (
                        orders.map(o => (
                            <div key={o.id} className="order-card-staff" onClick={() => setActiveOrder(o)} style={{ cursor: 'pointer' }}>
                                <div className="order-card-header">
                                    <h3>Order #{o.id}</h3>
                                    <span className="table-badge">Table {o.table?.tableNumber}</span>
                                </div>
                                <div className="order-card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px 15px' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🍽️</div>
                                    <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{o.items?.length || 0} Items</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status: {o.status}</div>
                                </div>
                                <div className="order-card-footer" style={{ textAlign: 'center', background: 'var(--primary-dark)', color: 'white', fontWeight: 'bold' }}>
                                    View Details
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {activeOrder && (
                    <div className="modal-backdrop" onClick={() => setActiveOrder(null)}>
                        <div className="modal-content-glass" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Order #{activeOrder.id}</h2>
                                <button className="modal-close" onClick={() => setActiveOrder(null)}>×</button>
                            </div>
                            
                            <div className="modal-details">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <span className="table-badge" style={{ fontSize: '1rem', padding: '6px 15px' }}>Table {activeOrder.table?.tableNumber}</span>
                                    <span className="status-badge" style={{ background: '#f39c12' }}>{activeOrder.status}</span>
                                </div>

                                <h3>Items to Prepare:</h3>
                                <ul className="order-items-list" style={{ marginTop: '15px', marginBottom: '30px' }}>
                                    {activeOrder.items.map(item => (
                                        <li key={item.id} style={{ fontSize: '1.1rem', padding: '12px 0' }}>
                                            <span className="qty" style={{ fontSize: '1.2rem', minWidth: '40px' }}>{item.quantity}x</span>
                                            <span className="name" style={{ fontWeight: '600' }}>{item.menuItem?.name || 'Item'}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="card-actions">
                                    {!activeOrder.isPrepared && (
                                        <button className="btn-preparing" style={{ padding: '15px', fontSize: '1.1rem' }} onClick={() => updateStatus(activeOrder.id, 'Preparing')}>
                                            Mark Preparing
                                        </button>
                                    )}
                                    {activeOrder.isPrepared && !activeOrder.isServed && (
                                        <button className="btn-served" style={{ padding: '15px', fontSize: '1.1rem' }} onClick={() => updateStatus(activeOrder.id, 'Served')}>
                                            Mark Served
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default KitchenPage;
