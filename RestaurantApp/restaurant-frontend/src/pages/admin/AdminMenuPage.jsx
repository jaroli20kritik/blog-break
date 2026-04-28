import { API_BASE } from '../../config';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout';

const AdminMenuPage = () => {
    const { token } = useAuth();
    const [categories, setCategories] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [newItem, setNewItem] = useState({ name: '', price: '', categoryId: '', isAvailable: true });
    const [newCatName, setNewCatName] = useState('');
    const [showAddItem, setShowAddItem] = useState(false);
    const headers = { Authorization: `Bearer ${token}` };

    const fetchMenu = async () => {
        const res = await axios.get(`${API_BASE}/api/Menu/admin`, { headers });
        setCategories(res.data);
    };

    useEffect(() => { fetchMenu(); }, []);

    const addCategory = async (e) => {
        e.preventDefault();
        if (!newCatName.trim()) return;
        await axios.post(`${API_BASE}/api/Menu/category`, { name: newCatName }, { headers });
        setNewCatName('');
        fetchMenu();
    };

    const deleteCategory = async (id) => {
        // Optimistically remove from UI
        setCategories(prev => prev.filter(c => c.id !== id));
        try {
            await axios.delete(`${API_BASE}/api/Menu/category/${id}`, { headers });
        } catch (err) {
            console.error(err);
            alert('Failed to delete category.');
            fetchMenu(); // Revert on failure
        }
    };

    const addItem = async (e) => {
        e.preventDefault();
        await axios.post(`${API_BASE}/api/Menu/item`, { ...newItem, price: parseFloat(newItem.price), categoryId: parseInt(newItem.categoryId) }, { headers });
        setNewItem({ name: '', price: '', categoryId: '', isAvailable: true });
        setShowAddItem(false);
        fetchMenu();
    };

    const saveEdit = async (e) => {
        e.preventDefault();
        await axios.put(`${API_BASE}/api/Menu/item/${editingItem.id}`, editingItem, { headers });
        setEditingItem(null);
        fetchMenu();
    };

    const deleteItem = async (id) => {
        // Optimistically remove from UI
        setCategories(prev => prev.map(c => ({ ...c, items: c.items?.filter(i => i.id !== id) })));
        try {
            await axios.delete(`${API_BASE}/api/Menu/item/${id}`, { headers });
        } catch (err) {
            console.error(err);
            alert('Failed to delete item.');
            fetchMenu(); // Revert
        }
    };

    const toggleAvailability = async (id) => {
        await axios.patch(`${API_BASE}/api/Menu/item/${id}/toggle`, {}, { headers });
        fetchMenu();
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <div className="admin-page-header">
                    <h1>Menu Management</h1>
                    <button className="btn-add" onClick={() => setShowAddItem(!showAddItem)}>+ Add Item</button>
                </div>

                {/* Add Category */}
                <form className="add-category-form" onSubmit={addCategory}>
                    <input value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="New category name..." />
                    <button type="submit" className="btn-add-secondary">+ Add Category</button>
                </form>

                {/* Add Item Form */}
                {showAddItem && (
                    <form className="add-item-form" onSubmit={addItem}>
                        <h3>Add New Item</h3>
                        <div className="form-row">
                            <input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="Item name" required />
                            <input type="number" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} placeholder="Price (₹)" required min="0" />
                            <select value={newItem.categoryId} onChange={e => setNewItem({ ...newItem, categoryId: e.target.value })} required>
                                <option value="">Select category...</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <button type="submit" className="btn-add">Save</button>
                            <button type="button" className="btn-cancel" onClick={() => setShowAddItem(false)}>Cancel</button>
                        </div>
                    </form>
                )}

                {/* Categories + Items */}
                {categories.map(cat => (
                    <div key={cat.id} className="menu-category-block">
                        <div className="menu-cat-header">
                            <h2>{cat.name}</h2>
                            <button className="btn-delete-cat" onClick={() => deleteCategory(cat.id)}>✕ Delete Category</button>
                        </div>
                        <table className="admin-table">
                            <thead>
                                <tr><th>Name</th><th>Price</th><th>Available</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {cat.items?.map(item => (
                                    <tr key={item.id}>
                                        {editingItem?.id === item.id ? (
                                            <>
                                                <td><input value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /></td>
                                                <td><input type="number" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})} /></td>
                                                <td><input type="checkbox" checked={editingItem.isAvailable} onChange={e => setEditingItem({...editingItem, isAvailable: e.target.checked})} /></td>
                                                <td>
                                                    <button className="action-btn action-btn-save" onClick={saveEdit}>Save</button>
                                                    <button className="action-btn" onClick={() => setEditingItem(null)}>Cancel</button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{item.name}</td>
                                                <td>₹{item.price}</td>
                                                <td>
                                                    <span className={`avail-badge ${item.isAvailable ? 'avail-yes' : 'avail-no'}`}
                                                          onClick={() => toggleAvailability(item.id)} style={{ cursor: 'pointer' }}>
                                                        {item.isAvailable ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="action-btn action-btn-edit" onClick={() => setEditingItem({...item})}>Edit</button>
                                                    <button className="action-btn action-btn-delete" onClick={() => deleteItem(item.id)}>Delete</button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
};

export default AdminMenuPage;
