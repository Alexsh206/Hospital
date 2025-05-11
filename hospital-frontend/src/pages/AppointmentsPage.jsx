import { useState, useEffect } from 'react';
import { getAppointments, deleteAppointment } from '../api/appointments';
import { useNavigate } from 'react-router-dom';

export default function AppointmentsPage() {
    const [list, setList] = useState([]);
    const nav = useNavigate();

    useEffect(() => {
        getAppointments().then(res => setList(res.data));
    }, []);

    const onDelete = id => {
        if (!confirm('Видалити призначення?')) return;
        deleteAppointment(id).then(() =>
            setList(list.filter(a => a.appointmentId !== id))
        );
    };

    return (
        <table>
            <thead>
            <tr>
                <th>ID</th><th>Дата</th><th>Діагноз</th><th>Ліки</th><th>Процедури</th>
                <th>Операції</th><th>Статус</th><th>Лікар</th><th>Пацієнт</th><th>Дії</th>
            </tr>
            </thead>
            <tbody>
            {list.map(a => (
                <tr key={a.appointmentId}>
                    <td>{a.appointmentId}</td>
                    <td>{a.appointmentDate}</td>
                    <td>{a.diagnosis}</td>
                    <td>{a.medication}</td>
                    <td>{a.procedure}</td>
                    <td>{a.surgery}</td>
                    <td>{a.status}</td>
                    <td>{a.doctorId}</td>
                    <td>{a.patientId}</td>
                    <td>
                        <button onClick={()=>nav(`/appointments/${a.appointmentId}/edit`)}>Edit</button>
                        <button onClick={()=>onDelete(a.appointmentId)}>Del</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
