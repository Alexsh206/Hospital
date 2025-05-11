import { useState, useEffect } from 'react';
import { getAppointmentById, updateAppointment } from '../api/appointments';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditAppointmentPage(){
    const { id } = useParams();
    const nav = useNavigate();
    const [form, setForm] = useState(null);

    useEffect(() => {
        getAppointmentById(id).then(r => setForm(r.data));
    }, [id]);

    if (!form) return <div>Loading…</div>;

    const handle = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const submit = async e => {
        e.preventDefault();
        await updateAppointment(form);
        nav('/appointments');
    };

    return (
        <form onSubmit={submit} style={{ padding:20 }}>
            {/* те же поля, что и в Add, но с заполнением form[...] */}
            <div>
                <label>Статус:<br/>
                    <select name="status" value={form.status} onChange={handle}>
                        <option value="PENDING">PENDING</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="DISCHARGED">DISCHARGED</option>
                    </select>
                </label>
            </div>
            <div>
                <label>Остаточний діагноз (при виписці):<br/>
                    <input
                        name="finalDiagnosis"
                        value={form.finalDiagnosis || ''}
                        onChange={handle}
                        placeholder="Вкажіть остаточний діагноз"
                    />
                </label>
            </div>
            <button type="submit" style={{ marginTop:10 }}>Зберегти</button>
        </form>
    );
}
