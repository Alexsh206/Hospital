import React, { useState, useEffect } from 'react'
import { useNavigate }      from 'react-router-dom'
import { useAuth }          from '../auth/AuthProvider'
import * as api             from '../api/api'
import './EditAdd.css';

export default function AddAppointmentPage() {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        appointmentDate: '',
        diagnosis:       '',
        medication:      '',
        surgery:         '',
        procedureName:   '',
        status:          'EXPECTING',
        doctorId:        '',
        patientId:       '',
    })

    const [patientsList, setPatientsList] = useState([])

    useEffect(() => {
        api.getAllPatients()
            .then(({ data }) => setPatientsList(data))
            .catch(console.error)
    }, [])

    useEffect(() => {
        if (user?.id) {
            setForm(f => ({ ...f, doctorId: String(user.id) }))
        }
    }, [user?.id])

    const handleChange = e => {
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: value }))
    }

    const handleSubmit = async e => {
        e.preventDefault()
        const payload = {
            appointmentDate: form.appointmentDate,
            status:          form.status,
            doctorId:        Number(form.doctorId),
            patientId:       Number(form.patientId),
            ...(user.position === 'Doctor' && {
                diagnosis: form.diagnosis,
                surgery:   form.surgery
            }),
            medication:    form.medication,
            procedureName: form.procedureName,
        }
        try {
            await api.addAppointment(payload)
            navigate(`/dashboard/staff/${user.id}`, { replace: true })
        } catch {
            alert('Не вдалося створити призначення')
        }
    }

    return (
        <div className="page-container">
            <div className="patient-form-card">
                <h2>Нове призначення</h2>

                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="doctorId" value={form.doctorId} />

                    <div className="field">
                        <label>Дата призначення:</label>
                        <input
                            type="date"
                            name="appointmentDate"
                            value={form.appointmentDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {user.position === 'Doctor' && (
                        <>
                            <div className="field">
                                <label>Діагноз:</label>
                                <input
                                    type="text"
                                    name="diagnosis"
                                    value={form.diagnosis}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="field">
                                <label>Операція:</label>
                                <input
                                    type="text"
                                    name="surgery"
                                    value={form.surgery}
                                    onChange={handleChange}
                                    placeholder="Назва операції"
                                />
                            </div>
                        </>
                    )}

                    <div className="field">
                        <label>Ліки:</label>
                        <input
                            type="text"
                            name="medication"
                            value={form.medication}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="field">
                        <label>Процедура:</label>
                        <input
                            type="text"
                            name="procedureName"
                            value={form.procedureName}
                            onChange={handleChange}
                            placeholder="Назва процедури"
                        />
                    </div>

                    <div className="field">
                        <label>Статус:</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                        >
                            <option value="EXPECTING">Очікує</option>
                            <option value="IN_PROGRESS">В процесі</option>
                            <option value="COMPLETED">Завершено</option>
                        </select>
                    </div>

                    <div className="field">
                        <label>Пацієнт:</label>
                        <select
                            name="patientId"
                            value={form.patientId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">– оберіть пацієнта –</option>
                            {patientsList.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.firstName} {p.lastName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Створити призначення
                    </button>
                </form>
            </div>
        </div>
    )
}