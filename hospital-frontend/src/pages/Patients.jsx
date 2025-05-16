import React, { useEffect, useState } from 'react';
import { getPatients} from '../api/patients';
import {http} from "../api/api.js";
import {Link} from "react-router-dom";
import * as api from '../api/patients';
export const getPatientById   = id => http.get(`/patients/${id}`)
export const addPatient       = data => http.post('/patients', data)
export const updatePatient    = data => http.put(`/patients`, data)
export const deletePatient    = id   => http.delete(`/patients`, { params: { id } })

export default function PatientsPage() {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        getPatients()
            .then(res => setPatients(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleDelete = (id) => {
        if (!window.confirm('Ви справді хочете видалити цього пацієнта?')) return
        api.deletePatient(id)
            .then(() => load())
            .catch(err => alert('Не вдалося видалити: ' + err))
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
    )

    return (
        <div>
            <h1>Пацієнти</h1>
            <table>
                <thead>
                <tr>
                    <th>Ід</th><th>Прізвище</th><th>Ім’я</th><th>Телефон</th>
                </tr>
                </thead>
                <tbody>
                {patients.map(p => (
                    <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.lastName}</td>
                        <td>{p.firstName}</td>
                        <td>{p.phone}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
