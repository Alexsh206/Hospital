// src/App.jsx
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import PrivateRoute from './auth/PrivateRoute'

import LoginPage             from './pages/LoginPage'
import PatientsPage          from './pages/Patients'
import AddPatientPage        from './pages/AddPatientPage'
import EditPatientPage       from './pages/EditPatientPage'
import StaffPage             from './pages/Staff'
import AddStaffPage          from './pages/AddStaffPage'
import AppointmentsPage      from './pages/AppointmentsPage'
import AddAppointmentPage    from './pages/AddAppointmentPage'
import PatientDashboardPage  from './pages/PatientDashboardPage'
import StaffDashboardPage    from './pages/StaffDashboardPage'

export default function App() {
    const {
        user,
        isAuthenticated,
        loginWithRedirect,
        logout,
        isLoading
    } = useAuth0()

    if (isLoading) return <div>Завантаження…</div>

    // витягуємо ролі з токена
    const roles = user?.['https://hospital.api/roles'] || []

    return (
        <>
            <nav style={{ padding: 10, borderBottom: '1px solid #ccc' }}>
                {!isAuthenticated && (
                    <button
                        onClick={() =>
                            loginWithRedirect({
                                appState: {returnTo: window.location.pathname}
                            })
                        }
                    >
                        Увійти через Auth0
                    </button>
                )}

                {isAuthenticated && (
                    <>
                        {roles.includes('staff') && (
                            <>
                                <Link to={`/dashboard/staff/${user.sub}`}>Моя сторінка</Link>{' | '}
                                <Link to="/patients">Пацієнти</Link>{' | '}
                                <Link to="/patients/add">Додати пацієнта</Link>{' | '}
                                <Link to="/staff">Персонал</Link>{' | '}
                                <Link to="/staff/add">Додати працівника</Link>{' | '}
                                <Link to="/appointments">Призначення</Link>{' | '}
                                <Link to="/appointments/add">Нове призначення</Link>{' | '}
                            </>
                        )}

                        {roles.includes('patient') && (
                            <Link to={`/dashboard/patient/${user.sub}`}>
                                Моя медична картка
                            </Link>
                        )}

                        <button
                            style={{ marginLeft: 20 }}
                            onClick={() =>
                                logout({ logoutParams: { returnTo: window.location.origin } })
                            }
                        >
                            Вийти
                        </button>
                    </>
                )}
            </nav>

            <Routes>
                <Route
                    path="/"
                    element={
                        !isAuthenticated
                            ? <Navigate to="/login" replace />
                            : roles.includes('staff')
                                ? <Navigate to={`/dashboard/staff/${user.sub}`} replace />
                                : <Navigate to={`/dashboard/patient/${user.sub}`} replace />
                    }
                />

                <Route
                    path="/login"
                    element={<LoginPage onLogin={() => loginWithRedirect()} />}
                />

                {/* staff-only */}
                <Route element={<PrivateRoute roles={['staff']} />}>
                    <Route path="/patients"           element={<PatientsPage />} />
                    <Route path="/patients/add"       element={<AddPatientPage />} />
                    <Route path="/patients/:id/edit"  element={<EditPatientPage />} />
                    <Route path="/staff"              element={<StaffPage />} />
                    <Route path="/staff/add"          element={<AddStaffPage />} />
                    <Route path="/appointments"       element={<AppointmentsPage />} />
                    <Route path="/appointments/add"   element={<AddAppointmentPage />} />
                    <Route path="/dashboard/staff/:id" element={<StaffDashboardPage />} />
                </Route>

                <Route element={<PrivateRoute roles={['patient']} />}>
                    <Route path="/dashboard/patient/:id" element={<PatientDashboardPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    )
}
