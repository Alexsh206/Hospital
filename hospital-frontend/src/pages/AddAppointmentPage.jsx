import React, { useEffect, useState } from 'react';
import { addAppointment }    from '../api/appointments';
import { getStaff }          from '../api/staff';
import { getPatients }       from '../api/patients';
import { useNavigate }       from 'react-router-dom';
import { useAuth }           from '../auth/AuthProvider';

export default function AddAppointmentPage() {
    const { user } = useAuth();   // { role, position, id, name }
    const nav     = useNavigate();

    const [form, setForm] = useState({
        appointmentDate: '',
        diagnosis: '',
        medication: '',
        procedureName: '',
        surgery: '',
        status: 'PENDING',
        doctorId: '',
        patientId: ''
    });
    const [doctors, setDoctors]   = useState([]);
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        getStaff().then(r => setDoctors(r.data));
        getPatients().then(r => setPatients(r.data));
    }, []);

    const handle = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const submit = async e => {
        e.preventDefault();
        await addAppointment({
            ...form,
            doctorId:  Number(form.doctorId),
            patientId: Number(form.patientId),
        });
        nav('/appointments');
    };

    return (
        <form onSubmit={submit} style={{ padding: 20 }}>
            <h2>Нове призначення</h2>

            <div>
                <label>Дата призначення:<br/>
                    <input
                        type="date"
                        name="appointmentDate"
                        value={form.appointmentDate}
                        onChange={handle}
                        required
                    />
                </label>
            </div>

            <div>
                <label>Діагноз:<br/>
                    <input
                        type="text"
                        name="diagnosis"
                        value={form.diagnosis}
                        onChange={handle}
                        required
                    />
                </label>
            </div>

            <div>
                <label>Ліки:<br/>
                    <input
                        type="text"
                        name="medication"
                        value={form.medication}
                        onChange={handle}
                    />
                </label>
            </div>

            <div>
                <label>Процедури:<br/>
                    <input
                        type="text"
                        name="procedureName"
                        value={form.procedureName}
                        onChange={handle}
                    />
                </label>
            </div>

            {user.role === 'staff' && user.position === 'Doctor' && (
                <div>
                    <label>Операції:<br/>
                        <input
                            type="text"
                            name="surgery"
                            value={form.surgery}
                            onChange={handle}
                        />
                    </label>
                </div>
                )}

            <div>
                <label>Статус:<br/>
                    <select
                        name="status"
                        value={form.status}
                        onChange={handle}
                    >
                        <option value="PENDING">PENDING</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="DISCHARGED">DISCHARGED</option>
                    </select>
                </label>
            </div>

            <div>
                <label>Лікар:<br/>
                    <select
                        name="doctorId"
                        value={form.doctorId}
                        onChange={handle}
                        required
                    >
                        <option value="">– виберіть лікаря –</option>
                        {doctors.map(d => (
                            <option key={d.id} value={d.id}>
                                {d.lastName} {d.firstName} ({d.position})
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div>
                <label>Пацієнт:<br/>
                    <select
                        name="patientId"
                        value={form.patientId}
                        onChange={handle}
                        required
                    >
                        <option value="">– виберіть пацієнта –</option>
                        {patients.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.lastName} {p.firstName}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <button type="submit" style={{ marginTop: 10 }}>
                Створити призначення
            </button>
        </form>
    );
}