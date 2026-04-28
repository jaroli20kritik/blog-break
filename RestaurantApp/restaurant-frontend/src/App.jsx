import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TableProvider } from './context/TableContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import TablePage from './pages/TablePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import KitchenPage from './pages/admin/KitchenPage';
import AdminQRCodes from './pages/admin/AdminQRCodes';
import OrderTrackerPage from './pages/OrderTrackerPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminMenuPage from './pages/admin/AdminMenuPage';
import AdminTablesPage from './pages/admin/AdminTablesPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

const ProtectedRoute = ({ children }) => {
  const { token, isOwner, loading } = useAuth();
  if (loading) return <div className="content loader-container"><div className="spinner"></div></div>;
  if (!token || !isOwner) return <Navigate to="/admin/login" replace />;
  return children;
};

import SessionGuardian from './components/SessionGuardian';

const CustomerLayout = ({ children }) => (
  <SessionGuardian>
    <Navbar />
    {children}
  </SessionGuardian>
);

function App() {
  return (
    <AuthProvider>
      <TableProvider>
        <CartProvider>
          <Router>
            <div className="app-container">
              <Routes>
                {/* Customer Routes */}
                <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
                <Route path="/table/:tableNumber" element={<CustomerLayout><TablePage /></CustomerLayout>} />
                <Route path="/menu" element={<CustomerLayout><MenuPage /></CustomerLayout>} />
                <Route path="/cart" element={<CustomerLayout><CartPage /></CustomerLayout>} />
                <Route path="/payment" element={<CustomerLayout><PaymentPage /></CustomerLayout>} />
                <Route path="/track" element={<CustomerLayout><OrderTrackerPage /></CustomerLayout>} />
                <Route path="/admin/kitchen" element={<ProtectedRoute><KitchenPage /></ProtectedRoute>} />
                <Route path="/admin/qrcodes" element={<ProtectedRoute><AdminQRCodes /></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/orders" element={<ProtectedRoute><AdminOrdersPage /></ProtectedRoute>} />
                <Route path="/admin/menu" element={<ProtectedRoute><AdminMenuPage /></ProtectedRoute>} />
                <Route path="/admin/tables" element={<ProtectedRoute><AdminTablesPage /></ProtectedRoute>} />
                <Route path="/admin/reports" element={<ProtectedRoute><AdminReportsPage /></ProtectedRoute>} />
                <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </TableProvider>
    </AuthProvider>
  );
}

export default App;
