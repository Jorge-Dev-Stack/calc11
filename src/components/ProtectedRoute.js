import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
export default function ProtectedRoute({ children }) {
    const { currentUser } = useAuth();
    if (!currentUser) {
        return _jsx(Navigate, { to: "/signin" });
    }
    return _jsx(_Fragment, { children: children });
}
