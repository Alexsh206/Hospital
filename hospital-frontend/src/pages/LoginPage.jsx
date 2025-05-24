import React, { useState } from 'react'
import { useAuth }      from '../auth/AuthProvider'

export default function LoginPage() {
    const [phone, setPhone]       = useState('')
    const [password, setPassword] = useState('')
    const [error, setError]       = useState('')
    const [loading, setLoading]   = useState(false)
    const { login } = useAuth()

    const handleSubmit = async e => {
        e.preventDefault()
        setError('')
        setLoading(true)
        const ok = await login({ phone, password })
        setLoading(false)
        if (!ok) setError('Невірний телефон або пароль')
    }

    return (
        <div style={{ maxWidth: 400, margin: '2rem auto' }}>
            <h1>Увійти в систему</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Телефон:<br/>
                    <input
                        type="text"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="380XXXXXXXXX"
                        required
                        disabled={loading}
                    />
                </label>
                <label style={{ display: 'block', marginTop: 10 }}>
                    Пароль:<br/>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                </label>
                <button
                    type="submit"
                    style={{ marginTop: 15 }}
                    disabled={loading}
                >
                    {loading ? 'Завантаження...' : 'Увійти'}
                </button>
            </form>
        </div>
    )
}
