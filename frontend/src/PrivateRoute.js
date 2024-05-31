import React from 'react'
import {useSelector} from "react-redux"
import {Navigate, useLocation} from "react-router-dom"

const ProtectedRoute = ({children}) => {
    const { isAuthenticated, user, loading } = useSelector(state => state.user);
    let location = useLocation();
     if(!isAuthenticated && !loading && Object.keys(user).length === 0) {
        return <Navigate to="/login" state={{ from: location}} replace />
    }
 return children 

};

export default ProtectedRoute;