import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { cart } = useCart();
    const location = useLocation();
    const cartItemCount = cart.reduce((acc, item) => acc + item.qty, 0);

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">SAISAGAR</Link>
            </div>
            <div className="nav-links">
                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
                <Link to="/table/1" className={location.pathname.includes('/menu') || location.pathname.includes('/table') ? 'active' : ''}>Menu</Link>
                <Link to="/cart" className={location.pathname === '/cart' ? 'active' : ''}>
                    Cart {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
                </Link>
                <Link to="/track" className={location.pathname === '/track' ? 'active' : ''}>My Order</Link>
            </div>
        </nav>
    );
};

export default Navbar;
