import {Routes, Route, Navigate, Link} from 'react-router-dom'
import PrivateRoute from './auth/PrivateRoute'
import PatientsPage      from './pages/Patients'
import AddPatientPage    from './pages/AddPatientPage'
import StaffPage         from './pages/Staff'
import AddStaffPage      from './pages/AddStaffPage'
import AppointmentsPage  from './pages/AppointmentsPage'
import AddAppointmentPage from './pages/AddAppointmentPage'
import PatientDashboardPage from './pages/PatientDashboardPage'
import StaffDashboardPage   from './pages/StaffDashboardPage'
import LoginPage         from './pages/LoginPage'
import { useAuth }       from './auth/AuthProvider'
import EditPatientPage from "./pages/EditPatientPage.jsx";

export default function App() {
    const { user } = useAuth()

    return (
        <>
            <nav>
                {user?.role === 'staff' && <>
                    <Link to={`/dashboard/staff/${user.id}`}>Моя сторінка</Link>
                    <Link to="/patients">Список пацієнтів</Link>
                    <Link to="/patients/add">Додати пацієнта</Link>
                    <Link to="/staff">Персонал</Link>
                    <Link to="/staff/add">Додати працівника</Link>
                    <Link to="/appointments">Призначення</Link>
                    <Link to="/appointments/add">Нове призначення</Link>
                </>}
                {user?.role === 'patient' && <>
                    <Link to={`/dashboard/patient/${user.id}`}>Моя медична картка</Link>
                </>}
                <Link to="/login">Вийти з акаунту</Link>
            </nav>

            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route element={<PrivateRoute roles={['staff']} />}>
                    <Route path="/patients"      element={<PatientsPage />} />
                    <Route path="/patients/add"  element={<AddPatientPage />} />
                    <Route path="/patients/:id/edit" element={<EditPatientPage />} />
                    <Route path="/staff"         element={<StaffPage />} />
                    <Route path="/staff/add"     element={<AddStaffPage />} />
                    <Route path="/appointments"      element={<AppointmentsPage />} />
                    <Route path="/appointments/add"  element={<AddAppointmentPage />} />
                </Route>

                <Route element={<PrivateRoute roles={['patient']} />}>
                    <Route path="/dashboard/patient/:id" element={<PatientDashboardPage />} />
                </Route>

                <Route element={<PrivateRoute roles={['staff']} />}>
                    <Route path="/dashboard/staff/:id" element={<StaffDashboardPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </>
    )
}