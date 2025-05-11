import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthProvider'

export default function PrivateRoute({ roles }) {
    const { user, isAuthenticated } = useAuth()

    if (!isAuthenticated) {

        return <Navigate to="/login" replace />
    }
    if (roles && !roles.includes(user.role)) {

        return <Navigate to="/login" replace />
    }
    return <Outlet />
}