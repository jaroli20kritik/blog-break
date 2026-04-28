import { API_BASE } from '../config';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTableSession } from '../context/TableContext';
import { HubConnectionBuilder } from '@microsoft/signalr';

const statusSteps = ['Pending', 'Preparing', 'Served'];
const statusDesc = {
    'Pending': 'Your order has been received and is awaiting confirmation.',
    'Preparing': 'Our chefs are preparing your delicious meal!',
    'Served': 'Your order has been served. Enjoy your meal! 🍽️',
    'Paid': 'Payment confirmed. Awaiting final service... 🙏',
    'Completed': 'Order completed! Thank you for dining with us! ❤️'
};

const OrderTrackerPage = ({ orderId: propOrderId }) => {
    const { tableSession } = useTableSession();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        if (!tableSession?.tableId) return;
        try {
            const res = await axios.get(`${API_BASE}/api/Order/table/${tableSession.tableId}`);
            setOrders(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        if (!tableSession) { navigate('/'); return; }
        fetchOrders();

        const connection = new HubConnectionBuilder()
            .withUrl(`${API_BASE}/orderhub`)
            .withAutomaticReconnect()
            .build();

        connection.start().then(() => {
            connection.invoke('JoinTableGroup', tableSession.tableId).catch(console.error);
        });
        connection.on('OrderStatusChanged', (id, status) => {
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        });
        connection.on('OrderCreated', () => fetchOrders());
        connection.on('SessionEnded', () => {
            localStorage.removeItem('tableSession');
            window.location.href = '/';
        });

        return () => connection.stop();
    }, [tableSession]);

    if (loading) return (
        <div className="page-animate content loader-container">
            <div className="spinner"></div>
            <h3>Loading your orders...</h3>
        </div>
    );

    const activeOrders = orders.filter(o => o.status !== 'Served' && o.status !== 'Paid' && o.status !== 'Completed');
    const pastOrders = orders.filter(o => o.status === 'Served' || o.status === 'Paid' || o.status === 'Completed');

    return (
        <div className="page-animate">
            <header className="header">
                <div>
                    <h1>Your Orders</h1>
                    <small>Table {tableSession?.tableId}</small>
                </div>
                <button className="btn-outline" style={{ width: 'auto', padding: '8px 16px' }} onClick={() => navigate('/menu')}>
                    + Order More
                </button>
            </header>
            <div className="content">
                {orders.length === 0 && (
                    <div className="empty-state" style={{ marginTop: '40px' }}>
                        <p style={{ fontSize: '3rem', marginBottom: '16px' }}>🍽️</p>
                        <h3>No orders yet!</h3>
                        <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => navigate('/menu')}>Browse Menu</button>
                    </div>
                )}

                {activeOrders.map(order => {
                    const stepIndex = statusSteps.indexOf(order.status);
                    return (
                        <div key={order.id} className="tracker-card">
                            <div className="tracker-header">
                                <h2>Order #{order.id}</h2>
                                <span className="tracker-amount">₹{order.totalAmount}</span>
                            </div>

                            {/* Status Steps */}
                            <div className="tracker-steps">
                                {statusSteps.map((step, i) => (
                                    <div key={step} className={`tracker-step ${i <= stepIndex ? 'done' : ''} ${i === stepIndex ? 'active' : ''}`}>
                                        <div className="step-circle">
                                            {i < stepIndex ? '✓' : i + 1}
                                        </div>
                                        <div className="step-label">{step}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="tracker-status-desc">{statusDesc[order.status]}</div>

                            {/* Items */}
                            <div className="tracker-items">
                                {order.items?.map(item => (
                                    <div key={item.id} className="tracker-item">
                                        <span>{item.menuItem?.name} × {item.quantity}</span>
                                        <span>₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {pastOrders.length > 0 && (
                    <div style={{ marginTop: '32px' }}>
                        <h3 style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Completed Orders</h3>
                        {pastOrders.map(order => (
                            <div key={order.id} className="tracker-card tracker-card-muted">
                                <div className="tracker-header">
                                    <span>Order #{order.id}</span>
                                    <span className="status-badge" style={{ background: '#2ecc71' }}>{order.status}</span>
                                    <span>₹{order.totalAmount}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTrackerPage;
