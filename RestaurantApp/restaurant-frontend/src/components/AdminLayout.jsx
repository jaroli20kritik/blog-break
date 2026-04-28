import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/admin/orders', label: 'Orders', icon: '🧾' },
        { path: '/admin/kitchen', label: 'Kitchen', icon: '🍳' },
        { path: '/admin/menu', label: 'Menu', icon: '🍽️' },
        { path: '/admin/tables', label: 'Tables', icon: '🪑' },
        { path: '/admin/reports', label: 'Reports', icon: '📈' },
        { path: '/admin/qrcodes', label: 'QR Codes', icon: '📱' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="admin-shell">
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <span>🍛</span>
                    <span>SAISAGAR</span>
                </div>
                <nav className="admin-nav">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="admin-sidebar-footer">
                    <div className="admin-user-info">
                        <div className="admin-avatar">{user?.username?.[0]?.toUpperCase()}</div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.username}</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Owner</div>
                        </div>
                    </div>
                    <button className="admin-logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </aside>
            <main className="admin-main">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
