import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTableSession } from '../context/TableContext';

const TablePage = () => {
    const { tableNumber } = useParams();
    const navigate = useNavigate();
    const { initSession } = useTableSession();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const connectTable = async () => {
            try {
                // Pointing to ASP.NET Core API
                const response = await axios.get(`http://localhost:5021/api/Table/${tableNumber}`);
                
                // response.data contains the TableSession object
                initSession(response.data);
                
                // Allow user to see connection success for a moment
                setTimeout(() => {
                    navigate('/menu');
                }, 1000);
            } catch (err) {
                setError('Failed to connect to table. Please verify table number.');
            } finally {
                setLoading(false);
            }
        };

        if (tableNumber) {
            connectTable();
        }
    }, [tableNumber, navigate, initSession]);

    if (error) {
        return (
            <div className="page-animate content loader-container">
                <div style={{color: 'var(--primary-color)', fontSize: '48px', marginBottom: '16px'}}>⚠️</div>
                <h2 style={{textAlign: 'center'}}>{error}</h2>
            </div>
        );
    }

    return (
        <div className="page-animate content loader-container">
            <div className="spinner"></div>
            <h2>Connecting Table {tableNumber}...</h2>
            <p style={{color: 'var(--text-muted)'}}>Preparing your secure session</p>
        </div>
    );
};

export default TablePage;
