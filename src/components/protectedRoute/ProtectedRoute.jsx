import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import ErrorPage from '../../pages/errorPage/ErrorPage.jsx';

const ProtectedRoute = ({ isAuth, children }) => {
    const location = useLocation();

    if (!isAuth) {
        if (location.state?.logout) {
            return <Navigate to="/" replace />;
        } else {
            return <ErrorPage />;
        }
    }
    return children;
};

export default ProtectedRoute;
