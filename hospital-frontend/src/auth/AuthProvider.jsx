import React, { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as api from '../api/api'

const AuthContext = createContext({
    user: null,
    isAuthenticated: false,
    login: async () => false,
    logout: () => {}
})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const nav = useNavigate()

    // При старті — якщо в localStorage є токен, спробуємо довантажити профіль
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) return

        api.getProfile()
            .then(({ data }) => setUser(data))
            .catch(() => {
                localStorage.removeItem('token')
                setUser(null)
            })
    }, [])

    // login викликає /api/auth/login, очікує у відповіді { token, role, id, name, [position] }
    const login = async ({ phone, password }) => {
        const resp = await api.login({ phone, password }).catch(() => null)
        if (resp?.status === 200) {
            const { token, role, id, name, position } = resp.data

            // зберігаємо JWT
            localStorage.setItem('token', token)

            // локальний user
            const profile = { role, id, name, position }
            setUser(profile)

            // Redirect відразу на свій дашборд
            if (role === 'patient') {
                nav(`/dashboard/patient/${id}`, { replace: true })
            } else {
                nav(`/dashboard/staff/${id}`, { replace: true })
            }

            return true
        }

        return false
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
        nav('/login', { replace: true })
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
