import React from 'react';
import { Navigate } from 'react-router-dom';
import {UserModel} from "./models/user.ts";

type ProtectedRouteProps = {
    user: UserModel;
    children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, children }) => {
    if (!user || !user.name) {
        // Redirect to home if no username is set
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};

export default ProtectedRoute;
