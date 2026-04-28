import { API_BASE } from '../config';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useTableSession } from '../context/TableContext';
import { useCart } from '../context/CartContext';

const SessionGuardian = ({ children }) => {
    const { tableSession, clearSession } = useTableSession();
    const { clearCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        if (!tableSession?.tableId) return;

        const connection = new HubConnectionBuilder()
            .withUrl(`${API_BASE}/orderhub`)
            .withAutomaticReconnect()
            .build();

        connection.on('SessionEnded', () => {
            console.log("Session ended by admin.");
            clearSession();
            clearCart();
            navigate('/', { replace: true });
        });

        connection.start()
            .then(() => connection.invoke('JoinTableGroup', tableSession.tableId))
            .catch(console.error);

        return () => connection.stop();
    }, [tableSession, clearSession, clearCart, navigate]);

    return children;
};

export default SessionGuardian;
