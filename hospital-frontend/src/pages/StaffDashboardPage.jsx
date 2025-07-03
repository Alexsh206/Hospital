import React, { useEffect, useState } from 'react'
import { useNavigate }              from 'react-router-dom'
import { useAuth }                  from '../auth/AuthProvider'
import * as api                     from '../api/api'
import './StaffDashboardPage.css'

export default function StaffDashboardPage() {
    const { user, logout } = useAuth()
    const navigate         = useNavigate()
    const [patients,     setPatients]     = useState([])
    const [appointments, setAppointments] = useState([])

    useEffect(() => {
        api.getAllPatients()
            .then(r => setPatients(r.data))
            .catch(err => console.error('Не вдалось завантажити пацієнтів:', err))

        api.getAllAppointments()
            .then(r => setAppointments(r.data))
            .catch(err => console.error('Не вдалось завантажити призначення:', err))
    }, [])
    const handleDeletePatient = async id => {
        if (!window.confirm(`Видалити пацієнта #${id}?`)) return
        try {
            await api.deletePatient(id)
            setPatients(ps => ps.filter(p => p.id !== id))
        } catch {
            alert('Не вдалося видалити пацієнта')
        }
    }
    const handleDeleteAppointment = async id => {
        if (!window.confirm(`Видалити призначення #${id}?`)) return
        try {
            await api.deleteAppointment(id)
            setAppointments(ap => ap.filter(a => a.id !== id))
        } catch {
            alert('Не вдалося видалити призначення')
        }
    }
    const getPatientName = patientId => {
        const p = patients.find(x => x.id === patientId)
        return p ? `${p.firstName} ${p.lastName}` : `#${patientId}`
    }
    return (
        <div className="staff-dashboard">
            <div className="staff-card">
                <div>
                    <h2>Ваш профіль</h2>
                    <p><strong>Ім’я:</strong> {user.name}</p>
                    <p><strong>Посада:</strong> {user.position}</p>
                </div>
                <button className="btn btn-logout" onClick={logout}>
                    Вийти
                </button>
            </div>
            <section className="card">
                <h3>Список пацієнтів</h3>
                <button className="btn btn-primary" onClick={() => navigate('/patients/add')}>
                    Додати пацієнта
                </button>
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>ID</th><th>Ім’я</th><th>Телефон</th><th>Дата народження</th><th>Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {patients.length > 0 ? patients.map(p => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.firstName} {p.lastName}</td>
                            <td>{p.phone}</td>
                            <td>{p.dateOfBirth}</td>
                            <td>
                                {user.position === 'Doctor' && (
                                <>
                                <button className="btn btn-secondary"
                                        onClick={() => navigate(`/patients/${p.id}/edit`)}>
                                    Редагувати
                                </button>
                                </>
                                    )
                                }
                                <button className="btn btn-danger"
                                        onClick={() => handleDeletePatient(p.id)}>
                                    Видалити
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="5" className="empty">Немає пацієнтів</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </section>

            <section className="card">
                <h3>Список призначень</h3>
                <button className="btn btn-primary" onClick={() => navigate('/appointments/add')}>
                    Нове призначення
                </button>
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>ID</th><th>Пацієнт</th><th>Дата</th><th>Статус</th><th>Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {appointments.length > 0 ? appointments.map(app => (
                        <tr key={app.id}>
                            <td>{app.id}</td>
                            <td>{getPatientName(app.patientId)}</td>
                            <td>{new Date(app.appointmentDate).toLocaleDateString()}</td>
                            <td>
                  <span className={`status-badge status-${app.status}`}>
                    {app.status.replace('_', ' ')}
                  </span>
                            </td>
                            <td>
                                <button className="btn btn-secondary"
                                        onClick={() => navigate(`/appointments/${app.id}/edit`)}>
                                    Редагувати
                                </button>
                                <button className="btn btn-danger"
                                        onClick={() => handleDeleteAppointment(app.id)}>
                                    Видалити
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="5" className="empty">Немає призначень</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </section>
        </div>
    )
}
