// src/pages/LoginPage.jsx

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export default function LoginPage() {
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const auth = useAuth()
    const nav = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        const success = await auth.login({ phone, password })
        if (!success) {
            setError('Неправильний телефон або пароль')
        } else {
            // После успешного логина редирект уже происходит внутри auth.login
            // Но на всякий случай можно:
            nav('/', { replace: true })
        }
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>Увійти в систему</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Телефон:</label><br />
                    <input
                        type="text"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                    />
                </div>
                <div style={{ marginTop: 10 }}>
                    <label>Пароль:</label><br />
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div style={{ marginTop: 10 }}>
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    )
}
