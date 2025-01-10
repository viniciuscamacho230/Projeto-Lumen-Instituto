import React, { useState, useEffect } from 'react';
import HomePage from '../home/HomePage';
import { Box } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

const Dashboards = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {

        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            const userId = decoded.id;
            setIsAdmin(decoded.isAdmin);
        }

    }, []);
    return (
        <div>
            <HomePage></HomePage>
            {isAdmin && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: 'auto',
                        backgroundColor: 'white',
                        borderRadius: 'xl',
                        p: 5,
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                        margin: '1rem 2rem 1rem 2rem',
                        gap: 3,
                    }}>
                    <h1>teste</h1>
                </Box>
            )}
        </div>
    );
};

export default Dashboards;
