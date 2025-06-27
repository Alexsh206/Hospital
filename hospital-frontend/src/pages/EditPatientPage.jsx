import React, { useEffect, useState } from 'react'
import { useNavigate, useParams }    from 'react-router-dom'
import { useAuth }                    from '../auth/AuthProvider'
import * as api                       from '../api/api'

export default function EditPatientPage() {
    const { id }    = useParams()
    const { user }  = useAuth()
    const navigate  = useNavigate()
    const [form, setForm] = useState({
        lastName: '',
        firstName: '',
        patronymic: '',
        sex: 'M',
        dateOfBirth: '',
        phone: '',
        password: ''
    })
    const [error, setError] = useState(null)

    useEffect(() => {
        api.getPatientById(id)
            .then(({ data }) => setForm(data))
            .catch(() => {
                alert('Не вдалося завантажити дані пацієнта')
                navigate(`/dashboard/staff/${user.id}`, { replace: true })
            })
    }, [id])

    const handleChange = e => {
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: value }))
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            await api.updatePatient(id, form)
            // Після успіху — назад на дашборд персоналу
            navigate(`/dashboard/staff/${user.id}`, { replace: true })
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.error || 'Не вдалося оновити дані пацієнта')
        }
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>Редагувати пацієнта #{id}</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Прізвище:<br/>
                        <input name="lastName" value={form.lastName} onChange={handleChange} required/>
                    </label>
                </div>
                <div>
                    <label>Ім’я:<br/>
                        <input name="firstName" value={form.firstName} onChange={handleChange} required/>
                    </label>
                </div>
                <div>
                    <label>По батькові:<br/>
                        <input name="patronymic" value={form.patronymic} onChange={handleChange}/>
                    </label>
                </div>
                <div>
                    <label>Стать:<br/>
                        <select name="sex" value={form.sex} onChange={handleChange} required>
                            <option value="M">M</option>
                            <option value="F">F</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>Дата народження:<br/>
                        <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} required/>
                    </label>
                </div>
                <div>
                    <label>Телефон:<br/>
                        <input name="phone" value={form.phone} onChange={handleChange} required/>
                    </label>
                </div>
                {/* Можна лишити пароль незмінним, тому не обов'язково його редагувати */}
                <button type="submit" style={{ marginTop: 10 }}>Зберегти</button>
            </form>
        </div>
    )
}