import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTableSession } from '../context/TableContext';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const { tableSession } = useTableSession();
    const { cart, updateQty, removeFromCart, totalAmount, clearCart } = useCart();
    const navigate = useNavigate();
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const handlePlaceOrder = async () => {
        setIsPlacingOrder(true);
        try {
            const orderPayload = {
                tableId: tableSession.tableId,
                sessionToken: tableSession.sessionToken,
                items: cart.map(item => ({
                    menuItemId: item.id,
                    quantity: item.qty
                }))
            };

            const response = await axios.post('http://localhost:5021/api/Order/create', orderPayload);
            clearCart();
            // Pass order data to payment page
            navigate('/payment', { state: { order: response.data } });
        } catch (err) {
            console.error("Order creation failed", err);
            alert("Failed to place order. Is your session valid?");
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="page-animate content loader-container">
                <h2 style={{marginBottom: '16px'}}>Your cart is empty</h2>
                <button className="btn btn-primary" style={{width: 'auto'}} onClick={() => navigate('/menu')}>
                    Return to Menu
                </button>
            </div>
        );
    }

    return (
        <div className="page-animate" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header className="header">
                <div>
                    <button className="btn-outline" style={{width: 'auto', padding: '6px 12px', marginBottom: '8px'}} onClick={() => navigate('/menu')}>← Menu</button>
                    <h1>Your Cart</h1>
                </div>
            </header>
            
            <div className="content">
                {cart.map(item => (
                    <div key={item.id} className="cart-item">
                        <div style={{ flex: 1 }}>
                            <h3 style={{fontSize: '1rem'}}>{item.name}</h3>
                            <div style={{color: 'var(--primary-color)', fontWeight: 'bold'}}>₹{(item.price * item.qty).toFixed(2)}</div>
                        </div>
                        <div className="cart-qty-controls">
                            <button className="qty-btn" onClick={() => item.qty > 1 ? updateQty(item.id, -1) : removeFromCart(item.id)}>-</button>
                            <span style={{fontWeight: 600, width: '20px', textAlign: 'center'}}>{item.qty}</span>
                            <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ padding: '24px', background: 'var(--surface-color)', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.2rem'}}>
                    <span>Total To Pay</span>
                    <span className="total-amount">₹{totalAmount.toFixed(2)}</span>
                </div>
                <button 
                    className="btn btn-primary" 
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                >
                    {isPlacingOrder ? 'Processing...' : 'Place Order & Pay'}
                </button>
            </div>
        </div>
    );
};

export default CartPage;
