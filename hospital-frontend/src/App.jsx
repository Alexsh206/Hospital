// src/App.jsx
import React from 'react'
import {
    Routes,
    Route,
    Navigate
} from 'react-router-dom'
import { useAuth } from './auth/AuthProvider'

import LoginPage            from './pages/LoginPage'
import PatientDashboardPage from './pages/PatientDashboardPage'
import StaffDashboardPage   from './pages/StaffDashboardPage'
import AppointmentsPage     from './pages/AppointmentsPage'
import AddAppointmentPage   from './pages/AddAppointmentPage'
import EditAppointmentPage  from './pages/EditAppointmentPage'

function PrivateRoute({ children, staffOnly = false }) {
    const { user, isAuthenticated } = useAuth()

    // якщо не залогінені — на логін
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // якщо захищена зона тільки для персоналу
    if (staffOnly) {
        const allowed = ['Доктор', 'Медсестра', 'Медбрат']
        if (!allowed.includes(user.position)) {
            return (
                <div style={{ padding: 20, color: 'red' }}>
                    У вас недостатньо прав для доступу до цієї сторінки
                </div>
            )
        }
    }
    // якщо це «пацієнтська» сторінка, але ви — персонал
    else {
        if (user.position) {
            return (
                <div style={{ padding: 20, color: 'red' }}>
                    Ця сторінка доступна лише пацієнтам
                </div>
            )
        }
    }

    return children
}

// редірект з кореня на свій дашборд
function HomeRedirect() {
    const { user, isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // персонал
    if (user.position) {
        return <Navigate to={`/dashboard/staff/${user.id}`} replace />
    }

    // пацієнт
    return <Navigate to={`/dashboard/patient/${user.id}`} replace />
}

export default function App() {
    return (
        <Routes>
            {/* головний редірект */}
            <Route path="/" element={<HomeRedirect />} />

            {/* сторінка входу */}
            <Route path="/login" element={<LoginPage />} />

            {/* дашборд пацієнта */}
            <Route
                path="/dashboard/patient/:id"
                element={
                    <PrivateRoute>
                        <PatientDashboardPage />
                    </PrivateRoute>
                }
            />

            {/* дашборд персоналу */}
            <Route
                path="/dashboard/staff/:id"
                element={
                    <PrivateRoute staffOnly>
                        <StaffDashboardPage />
                    </PrivateRoute>
                }
            />

            {/* призначення (тільки для персоналу) */}
            <Route
                path="/appointments"
                element={
                    <PrivateRoute staffOnly>
                        <AppointmentsPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/appointments/add"
                element={
                    <PrivateRoute staffOnly>
                        <AddAppointmentPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/appointments/:id/edit"
                element={
                    <PrivateRoute staffOnly>
                        <EditAppointmentPage />
                    </PrivateRoute>
                }
            />

            {/* усе інше — назад на корінь */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
