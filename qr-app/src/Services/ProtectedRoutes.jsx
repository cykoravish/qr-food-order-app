import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';


function getCookies(name) {
    const value = `${document.cookie}`;
    const token = value.split(`${name}=`);
    if (token.length === 2) return token.pop().split(' ').shift();
}

export const ProtectedRoutes = () => {
    const isAuthenticated = getCookies('token');
    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}