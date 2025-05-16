import React, { useEffect, useState } from 'react';
import { getPatients} from '../api/patients';
import {Link} from "react-router-dom";
import * as api from '../api/patients';

export default function PatientsPage() {
    const [patients, setPatients] = useState([]);

    const loadPatients = () => {
        api.getPatients()
            .then(res => setPatients(res.data))
            .catch(err => console.error('Не вдалося завантажити пацієнтів', err))
    }

    useEffect(() => {
        loadPatients()
    }, [])

    useEffect(() => {
        getPatients()
            .then(res => setPatients(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleDelete = (id) => {
        if (!window.confirm('Ви справді хочете видалити цього пацієнта?')) return

        api.deletePatient(id)
            .then(() => loadPatients())
            .catch(err => alert('Не вдалося видалити пацієнта:\n' + err))
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>Пацієнти</h1>
            <Link to="/patients/add">+ Додати пацієнта</Link>
            <table border="1" cellPadding="5" style={{ marginTop: 10, width: '100%' }}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Прізвище</th>
                    <th>Ім’я</th>
                    <th>По батькові</th>
                    <th>Дата народження</th>
                    <th>Телефон</th>
                    <th>Дії</th>
                </tr>
                </thead>
                <tbody>
                {patients.map(p => (
                    <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.lastName}</td>
                        <td>{p.firstName}</td>
                        <td>{p.patronymic}</td>
                        <td>{p.dateOfBirth}</td>
                        <td>{p.phone}</td>
                        <td>
                            <Link to={`/patients/${p.id}/edit`}>Редагувати</Link>
                            {' | '}
                            <button onClick={() => handleDelete(p.id)}>Видалити</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
