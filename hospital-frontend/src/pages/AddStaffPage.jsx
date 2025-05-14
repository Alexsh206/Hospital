import React, { useState } from 'react';
import { addStaff } from '../api/staff';
import { useNavigate } from 'react-router-dom';

export default function AddStaffPage() {
    const [form, setForm] = useState({
        lastName: '',
        firstName: '',
        patronymic: '',
        position: 'Лікар', // значення за замовчуванням
        phone: '',
        password: ''
    });
    const nav = useNavigate();

    const handle = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const submit = async e => {
        e.preventDefault();
        await addStaff({ ...form });
        nav('/staff');
    };

    return (
        <form onSubmit={submit} style={{ padding: 20 }}>
            <div>
                <label>Прізвище:<br/>
                    <input name="lastName" value={form.lastName} onChange={handle} required/>
                </label>
            </div>
            <div>
                <label>Ім’я:<br/>
                    <input name="firstName" value={form.firstName} onChange={handle} required/>
                </label>
            </div>
            <div>
                <label>По батькові:<br/>
                    <input name="patronymic" value={form.patronymic} onChange={handle}/>
                </label>
            </div>
            <div>
                <label>Посада:<br/>
                    <select name="position" value={form.position} onChange={handle}>
                        <option value="Доктор">Доктор</option>
                        <option value="Медсестра">Медсестра</option>
                        <option value="Медбрат">Медбрат</option>
                    </select>
                </label>
            </div>
            <div>
                <label>Телефон:<br/>
                    <input name="phone" value={form.phone} onChange={handle} required/>
                </label>
            </div>
            <div>
                <label>Пароль:<br/>
                    <input type="password" name="password" value={form.password} onChange={handle} required/>
                </label>
            </div>
            <button type="submit" style={{ marginTop:10 }}>Додати працівника</button>
        </form>
    );
}