// src/pages/StaffDashboardPage.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as api from '../api/api'

export default function StaffDashboardPage() {
    const [patients, setPatients] = useState([])
    const [appointments, setAppointments] = useState([])
    const navigate = useNavigate()

    // підвантажуємо дані
    useEffect(() => {
        fetchPatients()
        fetchAppointments()
    }, [])

    const fetchPatients = () => {
        api.getAllPatients()
            .then(({ data }) => Array.isArray(data) ? setPatients(data) : setPatients([]))
            .catch(console.error)
    }

    const fetchAppointments = () => {
        api.getAllAppointments()
            .then(({ data }) => Array.isArray(data) ? setAppointments(data) : setAppointments([]))
            .catch(console.error)
    }

    // --- Пацієнти ---
    const handleAddPatient = () => {
        navigate('/patients/add')
    }
    const handleEditPatient = id => {
        navigate(`/patients/${id}/edit`)
    }
    const handleDeletePatient = async id => {
        if (!window.confirm('Ви справді хочете видалити цього пацієнта?')) return
        await api.deletePatient(id)
        fetchPatients()
    }

    // --- Призначення ---
    const handleAddAppointment = () => {
        navigate('/appointments/add')
    }
    const handleEditAppointment = id => {
        navigate(`/appointments/${id}/edit`)
    }
    const handleDeleteAppointment = async id => {
        if (!window.confirm('Ви справді хочете видалити це призначення?')) return
        await api.deleteAppointment(id)
        fetchAppointments()
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>Дашборд персоналу</h1>

            {/* Секція пацієнтів */}
            <section style={{ marginBottom: 40 }}>
                <h2>Список пацієнтів</h2>
                <button onClick={handleAddPatient}>Додати пацієнта</button>
                <table border="1" cellPadding="5" style={{ marginTop: 10, width: '100%' }}>
                    <thead>
                    <tr>
                        <th>ID</th><th>Ім’я</th><th>Телефон</th><th>День народження</th><th>Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {patients.map(p => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.firstName} {p.lastName}</td>
                            <td>{p.phone}</td>
                            <td>{p.dateOfBirth}</td>
                            <td>
                                <button onClick={() => handleEditPatient(p.id)}>Редагувати</button>{' '}
                                <button onClick={() => handleDeletePatient(p.id)}>Видалити</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </section>

            {/* Секція призначень */}
            <section>
                <h2>Список призначень</h2>
                <button onClick={handleAddAppointment}>Нове призначення</button>
                <table border="1" cellPadding="5" style={{ marginTop: 10, width: '100%' }}>
                    <thead>
                    <tr>
                        <th>ID</th><th>Пацієнт</th><th>Дата</th><th>Статус</th><th>Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {appointments.map(app => (
                        <tr key={app.id}>
                            <td>{app.id}</td>
                            <td>{app.patientId}</td>
                            <td>{new Date(app.appointmentDate).toLocaleDateString()}</td>
                            <td>{app.status}</td>
                            <td>
                                <button onClick={() => handleEditAppointment(app.id)}>Редагувати</button>{' '}
                                <button onClick={() => handleDeleteAppointment(app.id)}>Видалити</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </section>
        </div>
    )
}
