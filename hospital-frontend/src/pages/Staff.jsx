import { useEffect, useState } from 'react'
import { useApi } from '../api/api'

export default function StaffPage() {
    const API = useApi()
    const [doctors, setStaff] = useState([])

    useEffect(() => {
        API.get('/doctors')
            .then(res => setStaff(res.data))
            .catch(console.error)
    }, [])

    return (
        <div>
            <h2>Staff</h2>
            <ul>
                {staffpage.map(d => <li key={d.id}>{d.name} – {s.specialty}</li>)}
            </ul>
        </div>
    )
}