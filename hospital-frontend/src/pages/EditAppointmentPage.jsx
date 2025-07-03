import { useState, useEffect } from 'react';
import { getAppointmentById, updateAppointment } from '../api/appointments';
import { useNavigate, useParams } from 'react-router-dom';
import './EditAdd.css';

export default function EditAppointmentPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [form, setForm] = useState(null)

    useEffect(() => {
        getAppointmentById(id).then(r => setForm(r.data))
    }, [id])

    if (!form) {
        return <div className="page-container"><div className="patient-form-card">Loading…</div></div>
    }

    const handleChange = e => {
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: value }))
    }

    const handleSubmit = async e => {
        e.preventDefault()
        // Тут припускаємо, що back-end очікує поля { status, finalDiagnosis }
        await updateAppointment({ ...form, id })
        navigate('/appointments', { replace: true })
    }

    return (
        <div className="page-container">
            <div className="patient-form-card">
                <h2>Редагувати призначення</h2>

                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label>Статус:</label>
                        <select name="status" value={form.status} onChange={handleChange}>
                            <option value="PENDING">Очікує</option>
                            <option value="IN_PROGRESS">В процесі</option>
                            <option value="COMPLETED">Завершено</option>
                        </select>
                    </div>

                    <div className="field">
                        <label>Остаточний діагноз (при виписці):</label>
                        <input
                            type="text"
                            name="finalDiagnosis"
                            value={form.finalDiagnosis || ''}
                            onChange={handleChange}
                            placeholder="Вкажіть остаточний діагноз"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Зберегти
                    </button>
                </form>
            </div>
        </div>
    )
}