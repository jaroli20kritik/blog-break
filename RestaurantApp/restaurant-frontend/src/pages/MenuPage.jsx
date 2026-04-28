import { API_BASE } from '../config';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTableSession } from '../context/TableContext';
import { useCart } from '../context/CartContext';

const MenuPage = () => {
    const { tableSession } = useTableSession();
    const { cart, addToCart, updateQty, totalAmount } = useCart();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loadedImages, setLoadedImages] = useState({});

    useEffect(() => {
        if (!tableSession) {
            navigate('/table/1'); // redirect to default table for testing
            return;
        }

        const fetchMenu = async () => {
            try {
                const response = await axios.get(`${API_BASE}/api/Menu`);
                setCategories(response.data);
            } catch (err) {
                console.error("Failed to load menu", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, [tableSession, navigate]);

    if (loading) {
        return (
            <div className="page-animate content loader-container">
                <div className="spinner"></div>
                <h3>Loading Menu...</h3>
            </div>
        );
    }

    const cartItemCount = cart.reduce((acc, item) => acc + item.qty, 0);

    const filteredCategories = categories.map(cat => ({
        ...cat,
        items: cat.items.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(cat => 
        (selectedCategory === 'All' || cat.name === selectedCategory) && cat.items.length > 0
    );

    return (
        <div className="page-animate">
            <header className="header">
                <div>
                    <h1>Menu</h1>
                    <small>Table {tableSession?.tableId}</small>
                </div>
            </header>

            <div className="menu-controls">
                <div className="search-box">
                    <span style={{ fontSize: '1.1rem' }}>🔍</span>
                    <input 
                        type="text" 
                        placeholder="Search for dishes..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-tabs">
                    <button 
                        className={`filter-tab ${selectedCategory === 'All' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('All')}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button 
                            key={cat.id} 
                            className={`filter-tab ${selectedCategory === cat.name ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat.name)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="content" style={{ paddingBottom: cartItemCount > 0 ? '100px' : '24px', paddingTop: '16px' }}>
                {filteredCategories.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                        <p style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</p>
                        <h3>No dishes found!</h3>
                        <p>Try searching for something else.</p>
                    </div>
                ) : (
                    filteredCategories.map(category => (
                        <div key={category.id}>
                            <h2 className="category-title">{category.name}</h2>
                            {category.items.map(item => {
                                const cartItem = cart.find(i => i.id === item.id);
                                return (
                                    <div key={item.id} className="menu-item-card-premium">
                                        <div className="menu-item-details">
                                            <div>
                                                <div className="item-header">
                                                    <div className="item-name">{item.name}</div>
                                                    <div className={item.isVeg ? 'veg-indicator' : 'nonveg-indicator'}>
                                                        <div className={item.isVeg ? 'veg-dot' : 'nonveg-dot'}></div>
                                                    </div>
                                                </div>
                                                {item.description && <p className="item-desc">{item.description}</p>}
                                            </div>
                                            
                                            <div className="item-footer">
                                                <div className="menu-item-price">₹{item.price}</div>
                                                {cartItem ? (
                                                    <div className="qty-controls" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8f9fa', padding: '4px', borderRadius: '20px' }}>
                                                        <button className="qty-btn" style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => updateQty(item.id, -1)}>-</button>
                                                        <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{cartItem.qty}</span>
                                                        <button className="qty-btn" style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 'bold', color: 'var(--primary-color)' }} onClick={() => updateQty(item.id, 1)}>+</button>
                                                    </div>
                                                ) : (
                                                    <button className="add-btn" onClick={() => addToCart(item)} style={{ borderRadius: '8px', width: 'auto', padding: '4px 16px', fontSize: '0.9rem', fontWeight: '700' }}>ADD</button>
                                                )}
                                            </div>
                                        </div>
                                        {item.imageUrl ? (
                                            <div className="menu-item-image img-loading" style={{ borderRadius: '12px' }}>
                                                <img 
                                                    src={item.imageUrl} 
                                                    alt={item.name} 
                                                    className={`menu-item-image ${loadedImages[item.id] ? 'loaded' : ''}`}
                                                    onLoad={() => setLoadedImages(prev => ({ ...prev, [item.id]: true }))}
                                                />
                                            </div>
                                        ) : (
                                            <div className="menu-item-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', background: '#f1f2f6' }}>🥘</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))
                )}
            </div>

            {cartItemCount > 0 && (
                <div className="floating-cart-bar page-animate">
                    <div>
                        <div style={{fontWeight: 600}}>{cartItemCount} items</div>
                        <div className="total-amount">₹{totalAmount}</div>
                    </div>
                    <button className="btn btn-primary" style={{width: 'auto'}} onClick={() => navigate('/cart')}>
                        View Cart
                    </button>
                </div>
            )}
        </div>
    );
};

export default MenuPage;
