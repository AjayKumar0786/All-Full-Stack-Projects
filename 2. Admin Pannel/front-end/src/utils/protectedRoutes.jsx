import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoutes = () => {
    const user = sessionStorage.getItem('token'); 
    return user ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
