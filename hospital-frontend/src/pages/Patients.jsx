// src/pages/PatientsPage.jsx
import React, { useEffect, useState } from 'react';
import { getPatients, createPatient } from '../api/patients';

export default function PatientsPage() {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        getPatients()
            .then(res => setPatients(res.data))
            .catch(err => console.error(err));
    }, []);

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
