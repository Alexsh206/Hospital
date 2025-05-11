import { useState, useEffect } from 'react';
import { addAppointment } from '../api/appointments';
import { getStaff }      from '../api/staff';
import { getPatients }   from '../api/patients';
import { useNavigate }   from 'react-router-dom';

export default function AddAppointmentPage() {
    const [form, setForm] = useState({
        appointmentDate: '',
        diagnosis: '',
        medication: '',
        procedure: '',
        surgery: '',
        status: 'PENDING',
        doctorId: '',
        patientId: ''
    });
    const [doctors, setDoctors]   = useState([]);
    const [patients, setPatients] = useState([]);
    const nav = useNavigate();

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
            doctorId:   Number(form.doctorId),
            patientId:  Number(form.patientId),
        });
        nav('/appointments');
    };

    return (
        <form onSubmit={submit} style={{ padding:20 }}>
            <div>
                <label>Дата:<br/>
                    <input type="date" name="appointmentDate" value={form.appointmentDate} onChange={handle} required/>
                </label>
            </div>
            <div>
                <label>Діагноз:<br/>
                    <input name="diagnosis" value={form.diagnosis} onChange={handle} required/>
                </label>
            </div>
            <div><label>Ліки:<br/>
                <input name="medication" value={form.medication} onChange={handle}/>
            </label></div>
            <div><label>Процедури:<br/>
                <input name="procedure" value={form.procedure} onChange={handle}/>
            </label></div>
            <div><label>Операції:<br/>
                <input name="surgery" value={form.surgery} onChange={handle}/>
            </label></div>
            <div><label>Статус:<br/>
                <select name="status" value={form.status} onChange={handle}>
                    <option value="PENDING">PENDING</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="DISCHARGED">DISCHARGED</option>
                </select>
            </label></div>
            <div>
                <label>Лікар:<br/>
                    <select name="doctorId" value={form.doctorId} onChange={handle} required>
                        <option value="">– вибрати –</option>
                        {doctors.map(d => (
                            <option key={d.id} value={d.id}>{d.lastName} {d.firstName}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label>Пацієнт:<br/>
                    <select name="patientId" value={form.patientId} onChange={handle} required>
                        <option value="">– вибрати –</option>
                        {patients.map(p => (
                            <option key={p.id} value={p.id}>{p.lastName} {p.firstName}</option>
                        ))}
                    </select>
                </label>
            </div>
            <button type="submit" style={{ marginTop:10 }}>Створити</button>
        </form>
    );
}
