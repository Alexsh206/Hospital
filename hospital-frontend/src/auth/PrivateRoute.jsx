import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthProvider.jsx'

export default function PrivateRoute({ roles }) {
    const { isAuthenticated, user } = useAuth()


    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }
    if (!roles.includes(user.role)) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}