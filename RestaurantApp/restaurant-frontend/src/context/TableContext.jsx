import React, { createContext, useContext, useState, useEffect } from 'react';

const TableContext = createContext();

export const TableProvider = ({ children }) => {
    const [tableSession, setTableSession] = useState(() => {
        const saved = localStorage.getItem('tableSession');
        return saved ? JSON.parse(saved) : null;
    });

    const initSession = (sessionData) => {
        setTableSession(sessionData);
        localStorage.setItem('tableSession', JSON.stringify(sessionData));
    };

    const clearSession = () => {
        setTableSession(null);
        localStorage.removeItem('tableSession');
    };

    return (
        <TableContext.Provider value={{ tableSession, initSession, clearSession }}>
            {children}
        </TableContext.Provider>
    );
};

export const useTableSession = () => useContext(TableContext);
