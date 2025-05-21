import React, { useEffect, useState } from 'react'
import { getPatientById }     from '../api/patients'
import { getAppointments }    from '../api/appointments'
import { useParams }          from 'react-router-dom'

export default function PatientDashboardPage() {
    const { id } = useParams()
    const [patient, setPatient]       = useState(null)
    const [appointments, setAppointments] = useState([])

    useEffect(() => {
        getPatientById(id).then(r => setPatient(r.data))
        getAppointments().then(r =>
            setAppointments(r.data.filter(a => a.patientId === Number(id)))
        )
    }, [id])

    if (!patient) return <div>Loading…</div>

    return (
        <div style={{ padding: 20 }}>
            <h2>Пацієнт: {patient.firstName} {patient.lastName}</h2>
            <p>Дата Народження: {patient.dateOfBirth}</p>
            <h3>Ваші призначення</h3>
            <ul>
                {appointments.map(a => (
                    <li key={a.id}>
                        {a.appointmentDate}: {a.diagnosis} – статус: {a.status}
                    </li>
                ))}
            </ul>
        </div>
    )
}