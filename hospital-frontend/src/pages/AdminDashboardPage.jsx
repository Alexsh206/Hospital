// src/pages/AdminDashboardPage.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth }     from '../auth/AuthProvider'
import * as api        from '../api/api'
import './StaffDashboardPage.css'

export default function AdminDashboardPage() {
    const { user, logout } = useAuth()
    const nav              = useNavigate()

    const [patients, setPatients] = useState([])
    const [staff, setStaff]       = useState([])

    // завантажуємо списки
    useEffect(() => {
        api.getAllPatients()
            .then(r => setPatients(r.data))
            .catch(console.error)

        api.getAllStaff()
            .then(r => setStaff(r.data))
            .catch(console.error)
    }, [])

    // видалення пацієнта
    const handleDeletePatient = async id => {
        if (!window.confirm(`Видалити пацієнта #${id}?`)) return
        try {
            await api.deletePatient(id)
            setPatients(ps => ps.filter(p => p.id !== id))
        } catch {
            alert('Не вдалося видалити пацієнта')
        }
    }

    // видалення співробітника
    const handleDeleteStaff = async id => {
        if (!window.confirm(`Видалити працівника #${id}?`)) return
        try {
            await api.deleteStaff(id)
            setStaff(ss => ss.filter(s => s.id !== id))
        } catch {
            alert('Не вдалося видалити працівника')
        }
    }

    return (
        <div className="staff-dashboard">
            <div className="staff-card">
                <h2>Адмін: {user.name}</h2>
                <button className="btn btn-danger btn-logout" onClick={logout}>
                    Вийти
                </button>
            </div>

            {/* Список пацієнтів */}
            <section className="card">
                <h3>Пацієнти</h3>
                <button
                    className="btn btn-primary"
                    onClick={() => nav('/patients/add')}
                >
                    Додати пацієнта
                </button>

                {patients.length > 0 ? (
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ім’я</th>
                            <th>Телефон</th>
                            <th>Дії</th>
                        </tr>
                        </thead>
                        <tbody>
                        {patients.map(p => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.firstName} {p.lastName}</td>
                                <td>{p.phone}</td>
                                <td>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => nav(`/patients/${p.id}/edit`)}
                                    >
                                        Редагувати
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDeletePatient(p.id)}
                                    >
                                        Видалити
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty">Немає жодного пацієнта</div>
                )}
            </section>

            {/* Список співробітників */}
            <section className="card">
                <h3>Персонал</h3>
                <button
                    className="btn btn-primary"
                    onClick={() => nav('/staff/add')}
                >
                    Додати співробітника
                </button>

                {staff.length > 0 ? (
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ім’я</th>
                            <th>Посада</th>
                            <th>Телефон</th>
                            <th>Дії</th>
                        </tr>
                        </thead>
                        <tbody>
                        {staff.map(s => (
                            <tr key={s.id}>
                                <td>{s.id}</td>
                                <td>{s.firstName} {s.lastName}</td>
                                <td>{s.position}</td>
                                <td>{s.phone}</td>
                                <td>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => nav(`/staff/${s.id}/edit`)}
                                    >
                                        Редагувати
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteStaff(s.id)}
                                    >
                                        Видалити
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty">Немає жодного співробітника</div>
                )}
            </section>
        </div>
    )
}
