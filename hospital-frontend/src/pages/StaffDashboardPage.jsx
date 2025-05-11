import React, { useEffect, useState } from 'react';
import { getStaffById }      from '../api/staff';
import { getAppointments }   from '../api/appointments';
import { useParams, useNavigate } from 'react-router-dom';

export default function StaffDashboardPage() {
    const { id } = useParams();
    const nav = useNavigate();
    const [staff, setStaff] = useState(null);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        getStaffById(id).then(r => setStaff(r.data));
        getAppointments().then(r => setAppointments(r.data));
    }, [id]);

    if (!staff) return <div>Loading...</div>;

    return (
        <div style={{ padding:20 }}>
            <h2>Персонал: {staff.firstName} {staff.lastName}</h2>
            <p>Посада: {staff.position}</p>

            <h3>Усі призначення</h3>
            <button onClick={()=>nav('/appointments/add')}>Нове призначення</button>
            <table style={{ marginTop:10 }}>
                <thead>
                <tr>
                    <th>ID</th><th>Пацієнт</th><th>Дата</th><th>Діагноз</th><th>Статус</th>
                </tr>
                </thead>
                <tbody>
                {appointments.map(a=>(
                    <tr key={a.id}>
                        <td>{a.id}</td>
                        <td>{a.patientId}</td>
                        <td>{a.appointmentDate}</td>
                        <td>{a.diagnosis}</td>
                        <td>{a.status}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}