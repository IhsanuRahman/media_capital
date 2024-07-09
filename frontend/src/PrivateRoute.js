import React, { useEffect } from 'react'
import {  useDispatch, useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"
import { checkAuth } from './features/user';

const ProtectedRoute = ({ children }) => {
    
   
      
    const { isAuthenticated, user, loading,initial } = useSelector(state => state.user);
    let location = useLocation();
    console.log("isAuthenticated:", isAuthenticated);
    console.log("user:", user);
    console.log("loading:", loading);

    if (loading || initial){
        return <div>Loading...</div>;
    }
    if (!isAuthenticated && !loading && user && Object.keys(user).length === 0) {
        
        return <Navigate to="/login" state={{ from: location }} replace />
    }
    return children

};

export default ProtectedRoute;