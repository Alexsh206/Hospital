import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {useApi} from '../api/api'

export default function EditPatientPage() {
    const { id } = useParams()
    const api    = useApi()
    const nav    = useNavigate()

    const [form, setForm] = useState({
        lastName: '', firstName: '', patronymic: '',
        sex: 'M', dateOfBirth: '', phone: '', password: ''
    })

    useEffect(() => {
        api.getPatientById(id)
            .then(res => setForm(res.data))
            .catch(() => alert('Не вдалося завантажити дані'))
    }, [id])

    const handleChange = e => {
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: value }))
    }

    const handleSubmit = e => {
        e.preventDefault()
        api.updatePatient(form)
            .then(() => {
                alert('Дані оновлено')
                nav('/patients')
            })
            .catch(() => alert('Помилка при оновленні'))
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
                {/** … інші поля … */}
                <button type="submit">Зберегти</button>
            </form>
        </div>
    )
}