import React, { useState } from 'react'
import { useNavigate }    from 'react-router-dom'
import { useAuth }        from '../auth/AuthProvider.jsx'

export default function LoginPage() {
    const [phone, setPhone]     = useState('')
    const [password, setPassword] = useState('')
    const [error, setError]     = useState('')
    const { login }             = useAuth()
    const navigate              = useNavigate()

    const handleSubmit = async e => {
        e.preventDefault()
        setError('')

        const success = await login({ phone, password })
        if (!success) {
            setError('Неправильний телефон або пароль')
        } else {
            // После удачного логина пользователь будет перенаправлен из AuthProvider
            // Можно при желании добавить navigate здесь, но в login() он уже есть
        }
    }

    return (
        <div style={{ maxWidth: 400, margin: '2rem auto' }}>
            <h1>Увійти в систему</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Телефон:<br/>
                        <input
                            type="text"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="+380XXXXXXXXX"
                            required
                        />
                    </label>
                </div>
                <div style={{ marginTop: 10 }}>
                    <label>
                        Пароль:<br/>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit" style={{ marginTop: 15 }}>
                    Увійти
                </button>
            </form>
        </div>
    )
}
