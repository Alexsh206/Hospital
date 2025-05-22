import React from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import PrivateRoute   from './auth/PrivateRoute.jsx'
import { useAuth }    from './auth/AuthProvider.jsx'

import LoginPage      from './pages/LoginPage.jsx'
import PatientsPage   from './pages/Patients.jsx'
import AddPatientPage from './pages/AddPatientPage.jsx'
import StaffPage      from './pages/Staff.jsx'
import AddStaffPage   from './pages/AddStaffPage.jsx'
import AppointmentsPage  from './pages/AppointmentsPage.jsx'
import AddAppointmentPage from './pages/AddAppointmentPage.jsx'
import PatientDashboardPage from './pages/PatientDashboardPage.jsx'
import StaffDashboardPage   from './pages/StaffDashboardPage.jsx'

export default function App() {
    const { user, isAuthenticated, logout } = useAuth()

    return (
        <>
            <nav style={{ padding: 10 }}>
                {user?.role === 'staff' && <>
                    <Link to="/patients">Пацієнти</Link>{' '}
                    <Link to="/patients/add">Додати пацієнта</Link>{' '}
                    <Link to="/staff">Персонал</Link>{' '}
                    <Link to="/staff/add">Додати працівника</Link>{' '}
                    <Link to="/appointments">Призначення</Link>{' '}
                    <Link to="/appointments/add">Нове призначення</Link>{' '}
                </>}
                {user?.role === 'patient' && <>
                    <Link to={`/dashboard/patient/${user.id}`}>Моя картка</Link>{' '}
                </>}
                {isAuthenticated && <button onClick={logout}>Вийти</button>}
            </nav>

            <Routes>
                <Route path="/login" element={<LoginPage />} />

                {/* Раздел для staff */}
                <Route element={<PrivateRoute roles={['staff']} />}>
                    <Route path="/patients"      element={<PatientsPage />} />
                    <Route path="/patients/add"  element={<AddPatientPage />} />
                    <Route path="/staff"         element={<StaffPage />} />
                    <Route path="/staff/add"     element={<AddStaffPage />} />
                    <Route path="/appointments"      element={<AppointmentsPage />} />
                    <Route path="/appointments/add"  element={<AddAppointmentPage />} />
                    <Route path="/dashboard/staff/:id" element={<StaffDashboardPage />} />
                </Route>

                {/* Раздел для patient */}
                <Route element={<PrivateRoute roles={['patient']} />}>
                    <Route path="/dashboard/patient/:id" element={<PatientDashboardPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </>
    )
}