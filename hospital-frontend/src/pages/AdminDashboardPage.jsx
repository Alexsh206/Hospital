import React from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'


export default function AdminDashboardPage() {
    const { user } = useAuth()
    const { id }   = useParams()

    return (
        <div className="staff-dashboard">
            <div className="staff-card">
                <h2>Адмін: {user.name}</h2>
                <button className="btn btn-danger btn-logout" onClick={() => user.logout()}>Вийти</button>
            </div>

            <section className="card">
                <h3>Керування користувачами</h3>
                {/* тут наприклад список staff/patients з кнопками Додати/Редагувати/Видалити */}
            </section>
        </div>
    )
}