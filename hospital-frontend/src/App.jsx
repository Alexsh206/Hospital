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
import AddPatientPage from "./pages/AddPatientPage.jsx";
import EditPatientPage from "./pages/EditPatientPage.jsx";

function PrivateRoute({ children, staffOnly, doctorOnly }) {
    const { user, isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // загальні staff-сторінки
    if (staffOnly && !['Доктор','Медсестра','Медбрат'].includes(user.position)) {
        return <div style={{ padding:20, color:'red' }}>
            У вас недостатньо прав для доступу до цієї сторінки
        </div>
    }

    // тільки для пацієнтів: сторінка пацієнта
    if (!staffOnly && user.position) {
        return <div style={{ padding:20, color:'red' }}>
            Ця сторінка доступна лише пацієнтам
        </div>
    }

    // тільки для доктора: редагувати можуть лише лікарі
    if (doctorOnly && user.position !== 'Доктор') {
        return <div style={{ padding:20, color:'red' }}>
            Редагування призначень дозволене лише лікарям
        </div>
    }

    return children
}

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
                path="/dashboard/patient/:id"
                element={
                    <PrivateRoute staffOnly={false}>
                        <PatientDashboardPage/>
                    </PrivateRoute>
                }
            />
            <Route path="/patients/add"   element={<PrivateRoute staffOnly={true}><AddPatientPage/></PrivateRoute>} />

            <Route path="/patients/:id/edit" element={<PrivateRoute staffOnly={true}><EditPatientPage/></PrivateRoute>} />

            <Route
                path="/dashboard/staff/:id"
                element={
                    <PrivateRoute staffOnly={true}>
                        <StaffDashboardPage/>
                    </PrivateRoute>
                }
            />

            <Route
                path="/appointments"
                element={
                    <PrivateRoute staffOnly={true}>
                        <AppointmentsPage/>
                    </PrivateRoute>
                }
            />

            <Route
                path="/appointments/add"
                element={
                    <PrivateRoute staffOnly={true}>
                        <AddAppointmentPage/>
                    </PrivateRoute>
                }
            />

            <Route
                path="/appointments/:id/edit"
                element={
                    <PrivateRoute staffOnly={true} doctorOnly={true}>
                        <EditAppointmentPage/>
                    </PrivateRoute>
                }
            />
        </Routes>
    )
}