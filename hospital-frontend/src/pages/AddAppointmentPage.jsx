import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import * as appointmentsApi from '../api/appointments'
import * as patientsApi     from '../api/patients'
import * as staffApi        from '../api/staff'
import { AppointmentStatus } from '../api/appointments.js';

export default function AddAppointmentPage() {
    const { user } = useAuth()           // { id, name, role }
    const nav = useNavigate()

    const [form, setForm] = useState({
        appointmentDate: '',
        diagnosis: '',
        medication: '',
        procedureName: '',
        surgery: '',
        status: AppointmentStatus.PENDING,
        doctorId: '',
        patientId: '',
    })

    const [doctors, setDoctors]   = useState([])
    const [patients, setPatients] = useState([])

    useEffect(() => {
        // Получаем список врачей
        staffApi.getStaff()
            .then(res => setDoctors(res.data))
            .catch(console.error)

        // Получаем список пациентов
        patientsApi.getPatients()
            .then(res => setPatients(res.data))
            .catch(console.error)
    }, [])

    const handleChange = e => {
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: value }))
    }

    const handleSubmit = e => {
        e.preventDefault()
        appointmentsApi.addAppointment(form)
            .then(() => nav('/appointments'))
            .catch(console.error)
    }

    return (
        <div>
            <h1>Нове призначення</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Дата призначення:
                    <input
                        type="date"
                        name="appointmentDate"
                        value={form.appointmentDate}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Діагноз:
                    <input
                        name="diagnosis"
                        value={form.diagnosis}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Ліки:
                    <input
                        name="medication"
                        value={form.medication}
                        onChange={handleChange}
                    />
                </label>

                {/* Только для роли doctor */}
                {user.role === 'doctor' && (
                    <>
                        <label>
                            Процедури:
                            <input
                                name="procedureName"
                                value={form.procedureName}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Операції:
                            <input
                                name="surgery"
                                value={form.surgery}
                                onChange={handleChange}
                            />
                        </label>
                    </>
                )}

                <label>
                    Статус:
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                    >
                        {Object.values(AppointmentStatus).map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </label>

                <label>
                    Лікар:
                    <select
                        name="doctorId"
                        value={form.doctorId}
                        onChange={handleChange}
                    >
                        <option value="">— виберіть лікаря —</option>
                        {doctors.map(d => (
                            <option key={d.id} value={d.id}>
                                {d.lastName} {d.firstName} ({d.position})
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Пацієнт:
                    <select
                        name="patientId"
                        value={form.patientId}
                        onChange={handleChange}
                    >
                        <option value="">— виберіть пацієнта —</option>
                        {patients.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.lastName} {p.firstName}
                            </option>
                        ))}
                    </select>
                </label>

                <button type="submit">Створити призначення</button>
            </form>
        </div>
    )
}
