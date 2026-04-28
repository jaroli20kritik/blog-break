import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout';

const AdminReportsPage = () => {
    const { token } = useAuth();
    const [stats, setStats] = useState(null);
    const [payments, setPayments] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPayments, setTotalPayments] = useState(0);
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
        const [revRes, payRes] = await Promise.all([
            axios.get('http://localhost:5021/api/Reports/revenue', { headers }),
            axios.get(`http://localhost:5021/api/Reports/payments?page=${page}&pageSize=15`, { headers })
        ]);
        setStats(revRes.data);
        setPayments(payRes.data.payments);
        setTotalPayments(payRes.data.total);
    };

    useEffect(() => { fetchData(); }, [page]);

    const verifyPayment = async (paymentId) => {
        // Optimistically update the UI locally so the button disappears instantly
        setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'Completed' } : p));
        
        try {
            await axios.post(`http://localhost:5021/api/Payment/confirm/${paymentId}`, {}, { headers });
            fetchData(); // Reload stats and real data
        } catch (err) {
            console.error("Failed to verify payment", err);
            // Revert on failure
            fetchData();
            alert("Failed to verify payment. Please try again.");
        }
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <div className="admin-page-header">
                    <h1>Reports & Analytics</h1>
                </div>

                {stats && (
                    <>
                        {/* Top Stats */}
                        <div className="stats-grid">
                            <div className="stat-card stat-primary">
                                <div className="stat-icon">💰</div>
                                <div className="stat-value">₹{stats.totalRevenue?.toFixed(0)}</div>
                                <div className="stat-label">Total Revenue</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📋</div>
                                <div className="stat-value">{stats.totalOrders}</div>
                                <div className="stat-label">Total Orders</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📅</div>
                                <div className="stat-value">₹{stats.todayRevenue?.toFixed(0)}</div>
                                <div className="stat-label">Today's Revenue</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📊</div>
                                <div className="stat-value">₹{stats.avgOrderValue?.toFixed(0)}</div>
                                <div className="stat-label">Avg Order Value</div>
                            </div>
                        </div>

                        {/* Revenue Bar Chart */}
                        <div className="admin-section">
                            <h2>7-Day Revenue Trend</h2>
                            <div className="revenue-chart">
                                {stats.last7Days?.map((day, i) => {
                                    const maxRev = Math.max(...stats.last7Days.map(d => d.revenue), 1);
                                    const height = Math.max((day.revenue / maxRev) * 160, 4);
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
                    </>
                )}

                {/* Payment History */}
                <div className="admin-section">
                    <h2>Payment History <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({totalPayments} total)</span></h2>
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr><th>Payment ID</th><th>Order</th><th>Table</th><th>Amount</th><th>Method</th><th>Order Status</th><th>Payment Status</th><th>Action</th></tr>
                            </thead>
                            <tbody>
                                {payments.map(p => (
                                    <tr key={p.id}>
                                        <td>#{p.id}</td>
                                        <td>Order #{p.orderId}</td>
                                        <td>Table {p.order?.table?.tableNumber}</td>
                                        <td><strong>₹{p.amount}</strong></td>
                                        <td>{p.paymentMethod}</td>
                                        <td>
                                            <span className={`status-badge`} style={{ 
                                                background: p.order?.isServed ? '#2ecc71' : (p.order?.isPrepared ? '#3498db' : '#f39c12'), 
                                                fontSize: '0.75rem' 
                                            }}>
                                                {p.order?.isServed ? 'Served' : (p.order?.isPrepared ? 'Preparing' : 'Pending')}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge status-${p.status.toLowerCase()}`}>
                                                {p.status === 'Completed' ? 'Paid' : (p.status === 'Pending' ? 'Not Paid' : p.status)}
                                            </span>
                                        </td>
                                        <td>
                                            {p.status === 'Pending' ? (
                                                <button 
                                                    className="btn-served" 
                                                    style={{ padding: '6px 12px', fontSize: '0.8rem', width: 'auto' }}
                                                    onClick={() => verifyPayment(p.id)}
                                                >
                                                    Verify Payment
                                                </button>
                                            ) : (
                                                <span style={{color: 'var(--text-muted)'}}>-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {payments.length === 0 && <div className="empty-state">No payments recorded yet.</div>}
                    </div>
                    {totalPayments > 15 && (
                        <div className="pagination">
                            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                            <span>Page {page}</span>
                            <button disabled={payments.length < 15} onClick={() => setPage(p => p + 1)}>Next →</button>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminReportsPage;
