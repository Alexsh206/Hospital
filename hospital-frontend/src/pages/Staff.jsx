import { useEffect, useState } from 'react'
import { getStaff } from '../api/staff'

export default function StaffPage() {

    const [staff, setStaff] = useState([])

    useEffect(() => {
        getStaff()
            .then(res => setStaff(res.data))
            .catch(console.error)
    }, [])

    return (
        <div style={{ padding: 20 }}>
            <h2>Персонал</h2>
            <ul>
                {staff.map(s => (
                    <li key={s.id}>
                        {s.lastName} {s.firstName} — {s.position}
                    </li>
                ))}
            </ul>
        </div>
    )
}