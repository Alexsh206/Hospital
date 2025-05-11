import { useEffect, useState } from 'react';
import { getStaff, deleteStaff } from '../api/staff';
import { useNavigate } from 'react-router-dom';

export default function StaffPage() {
    const [list, setList] = useState([]);
    const nav = useNavigate();

    useEffect(() => {
        getStaff().then(res => setList(res.data));
    }, []);

    const onDelete = id => {
        if (!confirm('Видалити?')) return;
        deleteStaff(id).then(() => setList(list.filter(s => s.id !== id)));
    };

    return (
        <table>
            <thead>
            <tr><th>ID</th><th>Прізвище</th><th>Ім’я</th><th>Посада</th><th>Телефон</th><th>Дії</th></tr>
            </thead>
            <tbody>
            {list.map(s =>
                <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.lastName}</td>
                    <td>{s.firstName}</td>
                    <td>{s.position}</td>
                    <td>{s.phone}</td>
                    <td>
                        <button onClick={()=>nav(`/staff/${s.id}/edit`)}>Edit</button>
                        <button onClick={()=>onDelete(s.id)}>Del</button>
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    );
}