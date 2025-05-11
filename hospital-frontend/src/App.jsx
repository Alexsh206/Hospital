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

export default function App() {
    const { user } = useAuth()

    return (
        <>
            <nav>
                {user?.role === 'staff' && <>
                    <Link to="/patients">Паціенты</Link>
                    <Link to="/patients/add">Добавить пациента</Link>
                    <Link to="/staff">Персонал</Link>
                    <Link to="/staff/add">Добавить врача</Link>
                    <Link to="/appointments">Назначения</Link>
                    <Link to="/appointments/add">Новое назначение</Link>
                </>}
                {user?.role === 'patient' && <>
                    <Link to={`/dashboard/patient/${user.id}`}>Моя карточка</Link>
                </>}
                <Link to="/login">Выход</Link>
            </nav>

            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route element={<PrivateRoute roles={['staff']} />}>
                    <Route path="/patients"      element={<PatientsPage />} />
                    <Route path="/patients/add"  element={<AddPatientPage />} />
                    <Route path="/staff"         element={<StaffPage />} />
                    <Route path="/staff/add"     element={<AddStaffPage />} />
                    <Route path="/appointments"      element={<AppointmentsPage />} />
                    <Route path="/appointments/add"  element={<AddAppointmentPage />} />
                </Route>

                <Route element={<PrivateRoute roles={['patient']} />}>
                    <Route path="/dashboard/patient/:id" element={<PatientDashboardPage />} />
                </Route>


                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </>
    )
}