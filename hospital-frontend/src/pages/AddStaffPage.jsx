import { useState } from 'react';
import { addStaff } from '../api/staff';
import { useNavigate } from 'react-router-dom';

export default function AddStaffPage() {
    const [form, setForm] = useState({ lastName:'', firstName:'', patronymic:'', position:'', phone:'', password:'' });
    const nav = useNavigate();

    const handle = e => setForm({...form, [e.target.name]: e.target.value});
    const submit = async e => {
        e.preventDefault();
        await addStaff(form);
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
            <button>Додати</button>
        </form>
    );
}