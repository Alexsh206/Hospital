import React, { useEffect, useState } from 'react'
import { getAppointments }        from '../api/appointments'

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState([])

    useEffect(() => {
        // робимо запит один раз при першому рендері
        getAppointments().then(r => {
            setAppointments(r.data)
        }).catch(console.error)
    }, [])  // <- Залежності пусті! Тільки монтування

    return (
        <div style={{ padding:20 }}>
            <h1>Призначення</h1>
            <ul>
                {appointments.map(a => (
                    <li key={a.id}>
                        {a.appointmentDate}: {a.diagnosis} — <b>{a.status}</b>
                    </li>
                ))}
            </ul>
        </div>
    )
}
