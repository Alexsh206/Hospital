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

            <div>
                <label>Статус:<br/>
                    <select name="status" value={form.status} onChange={handle}>
                        <option value="PENDING">Очікує</option>
                        <option value="IN_PROGRESS">В процесі</option>
                        <option value="COMPLETED">Завершено</option>
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
