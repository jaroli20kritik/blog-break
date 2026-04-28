import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout';
import { HubConnectionBuilder } from '@microsoft/signalr';

const AdminDashboard = () => {
    const { token } = useAuth();
    const [stats, setStats] = useState(null);
    const [liveOrders, setLiveOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
        try {
            const [revenueRes, ordersRes] = await Promise.all([
                axios.get('http://localhost:5021/api/Reports/revenue', { headers }),
                axios.get('http://localhost:5021/api/Order/kitchen', { headers })
            ]);
            setStats(revenueRes.data);
            setLiveOrders(ordersRes.data);
        } catch (err) {
            console.error('Dashboard fetch error', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        const connection = new HubConnectionBuilder()
            .withUrl('http://localhost:5021/orderhub')
            .withAutomaticReconnect()
            .build();

        connection.start().then(() => {
            connection.invoke('JoinOwnerGroup').catch(console.error);
        });

        connection.on('NewOrder', () => fetchData());
        connection.on('OrderUpdated', () => fetchData());

        return () => connection.stop();
    }, [token]);

    const statusColor = { 'Pending': '#f39c12', 'Preparing': '#3498db', 'Served': '#2ecc71', 'Paid': '#9b59b6', 'Completed': '#00bcd4' };

    if (loading) return (
        <AdminLayout>
            <div className="admin-loading"><div className="spinner"></div><p>Loading Dashboard...</p></div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="admin-page">
                <div className="admin-page-header">
                    <h1>Dashboard</h1>
                    <span className="live-badge">🔴 LIVE</span>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">🧾</div>
                        <div className="stat-value">₹{stats?.todayRevenue?.toFixed(0) || 0}</div>
                        <div className="stat-label">Today's Revenue</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📋</div>
                        <div className="stat-value">{stats?.todayOrders || 0}</div>
                        <div className="stat-label">Today's Orders</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⏳</div>
                        <div className="stat-value">{stats?.pendingOrders || 0}</div>
                        <div className="stat-label">Pending Orders</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🍳</div>
                        <div className="stat-value">{stats?.preparingOrders || 0}</div>
                        <div className="stat-label">Being Prepared</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-value">₹{stats?.totalRevenue?.toFixed(0) || 0}</div>
                        <div className="stat-label">Total Revenue</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-value">₹{stats?.avgOrderValue?.toFixed(0) || 0}</div>
                        <div className="stat-label">Avg Order Value</div>
                    </div>
                </div>

                {/* Live Orders */}
                <div className="admin-section">
                    <h2>Active Orders <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({liveOrders.length})</span></h2>
                    {liveOrders.length === 0 ? (
                        <div className="empty-state">No active orders right now.</div>
                    ) : (
                        <div className="orders-grid">
                            {liveOrders.slice(0, 6).map(order => (
                                <div key={order.id} className="order-mini-card">
                                    <div className="order-mini-header">
                                        <span>Order #{order.id}</span>
                                        <span className="status-badge" style={{ background: statusColor[order.status] }}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                                        Table {order.table?.tableNumber} · ₹{order.totalAmount}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', marginTop: '6px', color: 'var(--text-muted)' }}>
                                        {order.items?.map(i => i.menuItem?.name).join(', ')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 7-Day Revenue Chart */}
                {stats?.last7Days && (
                    <div className="admin-section">
                        <h2>7-Day Revenue</h2>
                        <div className="revenue-chart">
                            {stats.last7Days.map((day, i) => {
                                const maxRev = Math.max(...stats.last7Days.map(d => d.revenue), 1);
                                const height = Math.max((day.revenue / maxRev) * 140, 4);
                                return (
                                    <div key={i} className="chart-bar-wrap">
                                        <div className="chart-value">₹{day.revenue}</div>
                                        <div className="chart-bar" style={{ height: `${height}px` }}></div>
                                        <div className="chart-label">{day.date}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
