import React, { useEffect, useState } from 'react'
import { useNavigate }              from 'react-router-dom'
import { useAuth }                  from '../auth/AuthProvider'
import * as api                      from '../api/api'

export default function StaffDashboardPage() {
    const { user } = useAuth()
    const navigate = useNavigate()

    // стани
    const [patients, setPatients]       = useState([])
    const [appointments, setAppointments] = useState([])

    // завантажуємо пацієнтів та призначення
    useEffect(() => {
        api.getAllPatients()
            .then(({ data }) => setPatients(data))
            .catch(console.error)

        api.getAllAppointments()
            .then(({ data }) => setAppointments(data))
            .catch(console.error)
    }, [])

    // видалити пацієнта
    const handleDeletePatient = async id => {
        if (!window.confirm('Видалити пацієнта #' + id + '?')) return
        try {
            await api.deletePatient(id)
            setPatients(p => p.filter(x => x.id !== id))
        } catch (err) {
            console.error(err)
            alert('Не вдалося видалити пацієнта')
        }
    }

    // видалити призначення
    const handleDeleteAppointment = async id => {
        if (!window.confirm('Видалити призначення #' + id + '?')) return
        try {
            await api.deleteAppointment(id)
            setAppointments(a => a.filter(x => x.id !== id))
        } catch (err) {
            console.error(err)
            alert('Не вдалося видалити призначення')
        }
    }

    return (
        <div style={{ padding: '1rem' }}>
            <h1>Дашборд персоналу</h1>

            {/* --- Список пацієнтів --- */}
            <section style={{ marginBottom: '2rem' }}>
                <h2>Список пацієнтів</h2>
                <button onClick={() => navigate('/patients/add')}>
                    Додати пацієнта
                </button>
                <table border="1" cellPadding="6" style={{ marginTop: '0.5rem', width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr>
                        <th>ID</th><th>Ім’я</th><th>Телефон</th><th>Д. н.</th><th>Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {patients.map(p => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.firstName} {p.lastName}</td>
                            <td>{p.phone}</td>
                            <td>{p.date_of_birth}</td>
                            <td>
                                <button onClick={() => navigate(`/patients/${p.id}/edit`)}>
                                    Редагувати
                                </button>{' '}
                                <button onClick={() => handleDeletePatient(p.id)}>
                                    Видалити
                                </button>
                            </td>
                        </tr>
                    ))}
                    {patients.length === 0 && (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>Немає пацієнтів</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </section>

            {/* --- Список призначень --- */}
            <section>
                <h2>Список призначень</h2>
                <button onClick={() => navigate('/appointments/add')}>
                    Нове призначення
                </button>
                <table border="1" cellPadding="6" style={{ marginTop: '0.5rem', width:'100%', borderCollapse: 'collapse' }}>
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
                                <button onClick={() => navigate(`/appointments/${app.id}/edit`)}>
                                    Редагувати
                                </button>{' '}
                                <button onClick={() => handleDeleteAppointment(app.id)}>
                                    Видалити
                                </button>
                            </td>
                        </tr>
                    ))}
                    {appointments.length === 0 && (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>Немає призначень</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </section>
        </div>
    )
}