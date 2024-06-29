import React from 'react'
import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"

const AdminProtectedRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useSelector(state => state.user);
    let location = useLocation();
    
    if (loading){
        return
    }
    if (!isAuthenticated && !loading && user && Object.keys(user).length === 0) {
        return <Navigate to="/admin/login" state={{ from: location }}    />
    }
    if (user.is_staff===false) {
        return <Navigate to="/admin/login" state={{ from: location }}    />
    }
    return children

};

export default AdminProtectedRoute;