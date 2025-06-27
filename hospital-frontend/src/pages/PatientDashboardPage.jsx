// src/pages/PatientDashboardPage.jsx
import React, { useEffect, useState } from 'react'
import { getPatientById }   from '../api/patients'
import { getAppointments }  from '../api/appointments'
import { useParams }        from 'react-router-dom'
import './PatientDashboardPage.css'  // <-- підключаємо стилі

export default function PatientDashboardPage() {
    const { id } = useParams()
    const [patient, setPatient]         = useState(null)
    const [appointments, setAppointments] = useState([])

    useEffect(() => {
        // Завантажуємо дані пацієнта
        getPatientById(id)
            .then(res => setPatient(res.data))
            .catch(console.error)

        // Завантажуємо всі призначення та фільтруємо по current patient
        getAppointments()
            .then(res => {
                const own = res.data.filter(a => a.patientId === Number(id))
                setAppointments(own)
            })
            .catch(console.error)
    }, [id])

    if (!patient) {
        return <div className="loading">Завантаження…</div>
    }

    return (
        <div className="patient-dashboard">
            <div className="patient-card">
                <h2 className="patient-name">
                    Пацієнт: {patient.firstName} {patient.lastName}
                </h2>
                <p className="patient-dob">
                    Дата народження: <strong>{patient.dateOfBirth}</strong>
                </p>
            </div>

            <section className="appointments-section">
                <h3>Ваші призначення</h3>

                {appointments.length > 0 ? (
                    <table className="appointments-table">
                        <thead>
                        <tr>
                            <th>Дата</th>
                            <th>Діагноз</th>
                            <th>Статус</th>
                        </tr>
                        </thead>
                        <tbody>
                        {appointments.map(a => (
                            <tr key={a.id}>
                                <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                                <td>{a.diagnosis || '–'}</td>
                                <td>
                    <span className={`status-badge status-${a.status}`}>
                      {a.status.replace('_', ' ')}
                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="no-appointments">
                        У вас ще немає призначень
                    </p>
                )}
            </section>
        </div>
    )
}
