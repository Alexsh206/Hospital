import { useState }   from 'react'
import { useAuth }    from '../auth/AuthProvider'

export default function LoginPage() {
    const { login } = useAuth()
    const [form, setForm] = useState({ phone: '', password: '' })
    const [error, setError] = useState(null)

    const handle = e => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    }

    const submit = async e => {
        e.preventDefault()
        const ok = await login(form)
        if (!ok) {
            setError('Неправильні телефон або пароль')
        }
    }

    return (
        <form onSubmit={submit} style={{ padding: 20 }}>
            <h2>Увійти в систему</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div>
                <label>Телефон:<br/>
                    <input
                        name="phone"
                        value={form.phone}
                        onChange={handle}
                        required
                    />
                </label>
            </div>
            <div>
                <label>Пароль:<br/>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handle}
                        required
                    />
                </label>
            </div>
            <button type="submit" style={{ marginTop: 10 }}>Login</button>
        </form>
    )
}