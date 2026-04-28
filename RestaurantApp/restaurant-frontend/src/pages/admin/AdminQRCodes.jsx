import { API_BASE } from '../../config';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';

const AdminQRCodes = () => {
    const [tables, setTables] = useState([]);

    const { token } = useAuth();
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/Table/all`);
                setTables(res.data);
            } catch (err) {
                console.error("Failed to fetch tables", err);
            }
        };
        fetchTables();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <div className="admin-page-header print-hidden">
                    <h1>Table QR Codes</h1>
                    <button className="btn-add" onClick={handlePrint} style={{background: 'var(--accent-vibrant)'}}>
                        Print All Codes
                    </button>
                </div>
                
                <div className="qr-grid">
                    {tables.map(table => {
                        const tableUrl = `${window.location.origin}/table/${table.tableNumber}`;
                        return (
                            <div key={table.id} className="qr-card">
                                <div className="qr-brand-label">SAISAGAR</div>
                                <h2>Table {table.tableNumber}</h2>
                                <div className="qr-wrapper">
                                    <QRCodeSVG 
                                        value={tableUrl} 
                                        size={220}
                                        bgColor={"#ffffff"}
                                        fgColor={"#1a1a1a"}
                                        level={"H"}
                                        includeMargin={true}
                                    />
                                </div>
                                <p className="qr-instructions">Scan to View Menu & Order</p>
                                <p className="qr-url print-hidden">{tableUrl}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminQRCodes;
