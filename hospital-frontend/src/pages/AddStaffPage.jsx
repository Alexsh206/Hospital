import React, { useState } from 'react'
import { addStaff }       from '../api/staff'
import { useNavigate }    from 'react-router-dom'
import './EditAdd.css'

export default function AddStaffPage() {
    const [form, setForm] = useState({
        lastName:   '',
        firstName:  '',
        patronymic: '',
        position:   '',
        phone:      '',
        password:   ''
    })
    const navigate = useNavigate()

    const handleChange = e => {
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: value }))
    }

    const handleSubmit = async e => {
        e.preventDefault()
        await addStaff(form)
        navigate('/staff')
    }

    return (
        <div className="page-container">
            <div className="patient-form-card">
                <h2>Додати працівника</h2>
                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label>Прізвище:</label>
                        <input name="lastName"   value={form.lastName}   onChange={handleChange} required/>
                    </div>
                    <div className="field">
                        <label>Ім’я:</label>
                        <input name="firstName"  value={form.firstName}  onChange={handleChange} required/>
                    </div>
                    <div className="field">
                        <label>По батькові:</label>
                        <input name="patronymic" value={form.patronymic} onChange={handleChange}/>
                    </div>
                    <div className="field">
                        <label>Посада:</label>
                        <select name="position"  value={form.position}  onChange={handleChange}>
                            <option value="">– оберіть посаду –</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Nurse">Nurse</option>
                        </select>
                    </div>
                    <div className="field">
                        <label>Телефон:</label>
                        <input name="phone"      value={form.phone}      onChange={handleChange} required/>
                    </div>
                    <div className="field">
                        <label>Пароль:</label>
                        <input type="password" name="password" value={form.password} onChange={handleChange} required/>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Додати працівника
                    </button>
                </form>
            </div>
        </div>
    )
}