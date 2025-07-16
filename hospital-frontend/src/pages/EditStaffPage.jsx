import React, { useState, useEffect } from 'react'
import { useNavigate, useParams }      from 'react-router-dom'
import { getStaffById, updateStaff }   from '../api/staff'
import './EditAdd.css'

export default function EditStaffPage() {
    const { id }       = useParams()
    const navigate     = useNavigate()
    const [form, setForm] = useState(null)

    useEffect(() => {
        getStaffById(id).then(res => setForm(res.data))
    }, [id])

    if (!form) {
        return (
            <div className="page-container">
                <div className="patient-form-card">Loading…</div>
            </div>
        )
    }

    const handleChange = e => {
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: value }))
    }

    const handleSubmit = async e => {
        e.preventDefault()
        await updateStaff(id, form)
        navigate('/staff')
    }

    return (
        <div className="page-container">
            <div className="patient-form-card">
                <h2>Редагувати працівника #{id}</h2>
                <form onSubmit={handleSubmit}>
                    {['lastName','firstName','patronymic','position','phone'].map(name => (
                        <div className="field" key={name}>
                            <label>{name}:</label>
                            <input
                                name={name}
                                value={form[name] || ''}
                                onChange={handleChange}
                                required={name !== 'patronymic'}
                            />
                        </div>
                    ))}
                    <button type="submit" className="btn btn-primary">
                        Зберегти
                    </button>
                </form>
            </div>
        </div>
    )
}