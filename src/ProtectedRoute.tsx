import React from 'react';
import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
    username: string;
    children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ username, children }) => {
    if (!username) {
        // Redirect to home if no username is set
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};

export default ProtectedRoute;
