import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        return !!token;
    };


    return isAuthenticated() ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;