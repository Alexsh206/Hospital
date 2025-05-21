import { useAuth0 } from '@auth0/auth0-react'
import { Navigate, Outlet } from 'react-router-dom'

export default function PrivateRoute({ roles = [] }) {
    const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

    if (isLoading) return <div>Loading…</div>;

    if (!isAuthenticated) {
        loginWithRedirect();
        return null;
    }

    const userRoles = user['https://hospital.api/roles'] || [];
    if (roles.length > 0 && !roles.some(r => userRoles.includes(r))) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}