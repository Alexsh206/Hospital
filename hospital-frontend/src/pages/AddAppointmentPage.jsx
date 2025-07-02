import React, { useState, useEffect } from 'react'
import { useNavigate }      from 'react-router-dom'
import { useAuth }          from '../auth/AuthProvider'
import * as api             from '../api/api'

export default function AddAppointmentPage() {
    const { user }    = useAuth()
    const navigate    = useNavigate()

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
            setForm(prev => ({ ...prev, doctorId: String(user.id) }))
        }
    }, [user?.id])

    const handleChange = e => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async e => {
        e.preventDefault()

        const payload = {
            appointmentDate: form.appointmentDate,
            status:          form.status,
            doctorId:        Number(form.doctorId),
            patientId:       Number(form.patientId),

            ...(user.position === 'Doctor' && {
                diagnosis:       form.diagnosis,
                surgery:         form.surgery
            }),

            medication:      form.medication,
            procedureName:   form.procedureName,
        }

        try {
            await api.addAppointment(payload)
            navigate(`/dashboard/staff/${user.id}`, { replace: true })
        } catch (err) {
            console.error(err)
            alert('Не вдалося створити призначення')
        }
    }

    return (
        <div style={{ maxWidth: 600, margin: '2rem auto' }}>
            <h1>Нове призначення</h1>

            <form onSubmit={handleSubmit}>

                <input type="hidden" name="doctorId" value={form.doctorId} />

                <div style={{ marginBottom: 12 }}>
                    <label>
                        Дата призначення:<br/>
                        <input
                            type="date"
                            name="appointmentDate"
                            value={form.appointmentDate}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>

                {user.position === 'Doctor' && (
                    <>
                        <div style={{ marginBottom: 12 }}>
                            <label>
                                Діагноз:<br/>
                                <input
                                    type="text"
                                    name="diagnosis"
                                    value={form.diagnosis}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                        </div>

                        <div style={{ marginBottom: 12 }}>
                            <label>
                                Операція:<br/>
                                <input
                                    type="text"
                                    name="surgery"
                                    value={form.surgery}
                                    onChange={handleChange}
                                    placeholder="Назва операції"
                                />
                            </label>
                        </div>
                    </>
                )}

                <div style={{ marginBottom: 12 }}>
                    <label>
                        Ліки:<br/>
                        <input
                            type="text"
                            name="medication"
                            value={form.medication}
                            onChange={handleChange}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>
                        Процедура:<br/>
                        <input
                            type="text"
                            name="procedureName"
                            value={form.procedureName}
                            onChange={handleChange}
                            placeholder="Назва процедури"
                        />
                    </label>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>
                        Статус:<br/>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                        >
                            <option value="EXPECTING">Очікує</option>
                            <option value="IN_PROGRESS">В процесі</option>
                            <option value="COMPLETED">Завершено</option>
                        </select>
                    </label>
                </div>

                <div style={{ marginBottom: 20 }}>
                    <label>
                        Пацієнт:<br/>
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
                    </label>
                </div>

                <button type="submit">Створити призначення</button>
            </form>
        </div>
    )
}