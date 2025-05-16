import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPatientById, updatePatient } from '../api/patients'

export default function EditPatientPage() {
    const { id } = useParams()
    const nav    = useNavigate()
    const [form, setForm] = useState({
        lastName: '', firstName: '', patronymic: '',
        sex: 'M', dateOfBirth: '', phone: '', password: ''
    })

    useEffect(() => {
        getPatientById(id)
            .then(res => setForm(res.data))
            .catch(() => alert('Не вдалося завантажити дані пацієнта'))
    }, [id])

    const handleChange = e => {
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: value }))
    }

    const handleSubmit = e => {
        e.preventDefault()
        updatePatient(id, form)
            .then(() => nav('/patients', { replace: true }))
            .catch(() => alert('Не вдалося оновити дані'))
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>Редагувати пацієнта #{id}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Прізвище:</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange} />
                </div>
                <div>
                    <label>Ім’я:</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange} />
                </div>

                <button type="submit">Зберегти</button>
            </form>
        </div>
    )
}