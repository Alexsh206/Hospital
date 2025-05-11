import { useState, useEffect } from 'react';
import { getStaffById, updateStaff } from '../api/staff';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditStaffPage(){
    const { id } = useParams();
    const nav = useNavigate();
    const [form, setForm] = useState(null);

    useEffect(() => {
        getStaffById(id).then(res => setForm(res.data));
    }, [id]);

    if (!form) return <div>Loading…</div>;

    const handle = e => setForm({...form, [e.target.name]: e.target.value});
    const submit = async e => {
        e.preventDefault();
        await updateStaff(id, form);
        nav('/staff');
    };

    return (
        <form onSubmit={submit}>
            {['lastName','firstName','patronymic','position','phone','password'].map(name=>(
                <div key={name}>
                    <label>
                        {name}: <input name={name} value={form[name]} onChange={handle}/>
                    </label>
                </div>
            ))}
            <button>Зберегти</button>
        </form>
    );
}