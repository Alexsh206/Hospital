import React from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import { useAuth } from './auth/AuthProvider'
import LoginPage            from './pages/LoginPage'
import PatientDashboardPage from './pages/PatientDashboardPage'
import StaffDashboardPage   from './pages/StaffDashboardPage'
import AppointmentsPage     from './pages/AppointmentsPage'
import AddAppointmentPage   from './pages/AddAppointmentPage'
import EditAppointmentPage  from './pages/EditAppointmentPage'
import AddPatientPage from "./pages/AddPatientPage.jsx"
import EditPatientPage from "./pages/EditPatientPage.jsx"
import AdminDashboardPage from './pages/AdminDashboardPage'
import AddStaffPage from "./pages/AddStaffPage.jsx";
import EditStaffPage from "./pages/EditStaffPage.jsx"
import HomePage from "./pages/MainPage.jsx";
import RegisterPage from './pages/RegisterPage'

function PrivateRoute({ children, staffOnly, doctorOnly }) {
    const { user, isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (!staffOnly && user.position) {
        return <div style={{ padding:20, color:'red' }}>
            Ця сторінка доступна лише пацієнтам</div>
    }

    if (doctorOnly && user.position !== 'Doctor') {
        return <div style={{ padding:20, color:'red' }}>
            Редагування призначень дозволене лише лікарям</div>
    }

    return children
}

export default function App() {
    return (
        <Routes>

            <Route path="/" element={<HomePage />} />

            <Route path="/login" element={<LoginPage />} />

            <Route path="/register" element={<RegisterPage />} />

            <Route path="/dashboard/patient/:id" element={<PrivateRoute staffOnly={false}><PatientDashboardPage/></PrivateRoute>}/>

            <Route path="/patients/add"   element={<PrivateRoute staffOnly={true}><AddPatientPage/></PrivateRoute>} />

            <Route path="/patients/:id/edit" element={<PrivateRoute staffOnly={true}><EditPatientPage/></PrivateRoute>} />

            <Route path="/dashboard/staff/:id" element={<PrivateRoute staffOnly={true}><StaffDashboardPage/></PrivateRoute>}/>

            <Route path="/dashboard/admin/:id" element={<PrivateRoute staffOnly={true}><AdminDashboardPage /></PrivateRoute>}/>

            <Route path="/appointments" element={<PrivateRoute staffOnly={true}><AppointmentsPage/></PrivateRoute>}/>

            <Route path="/appointments/add" element={<PrivateRoute staffOnly={true}><AddAppointmentPage/></PrivateRoute>}/>

            <Route path="/appointments/:id/edit" element={<PrivateRoute staffOnly={true} doctorOnly={true}><EditAppointmentPage/></PrivateRoute>}/>

            <Route path="/staff/add" element={<PrivateRoute staffOnly={true}><AddStaffPage/></PrivateRoute>}/>

            <Route path="/staff/:id/edit" element={<PrivateRoute staffOnly={true}><EditStaffPage/></PrivateRoute>}/>

        </Routes>
    )
}