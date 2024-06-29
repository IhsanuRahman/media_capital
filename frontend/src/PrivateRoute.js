import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"
import { checkAuth } from './features/user';

const ProtectedRoute = ({ children }) => {
    
      
    const { isAuthenticated, user, loading } = useSelector(state => state.user);
    let location = useLocation();
    if (loading){
        return
    }
    if (!isAuthenticated && !loading && user && Object.keys(user).length === 0) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }
    return children

};

export default ProtectedRoute;