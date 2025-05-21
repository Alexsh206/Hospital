import { useAuth0 } from '@auth0/auth0-react'

export default function LoginPage() {
    const { loginWithRedirect, isLoading, error } = useAuth0()

    if (isLoading) return <div>Завантаження…</div>
    if (error) return <div>Помилка: {error.message}</div>

    return (
        <div>
            <h1>Увійти в систему</h1>
            <button onClick={() => loginWithRedirect()}>
                Увійти через Auth0
            </button>
        </div>
    )
}