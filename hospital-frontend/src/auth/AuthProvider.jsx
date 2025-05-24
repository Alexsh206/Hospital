import React, {
    createContext, useState, useContext
} from 'react'
import { useNavigate } from 'react-router-dom'
import * as api from '../api/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const nav = useNavigate()

    const login = async ({ phone, password }) => {
        const resp = await api.login({ phone, password }).catch(() => null)
        if (resp?.status === 200) {
            const profile = resp.data
            localStorage.setItem('token', profile.token)
            setUser(profile)

            if (profile.position === 'Доктор') {
                nav(`/dashboard/staff/${profile.id}`, { replace: true })
            } else if (profile.role === 'patient') {
                nav(`/dashboard/patient/${profile.id}`, { replace: true })
            } else {
                nav(`/dashboard/staff/${profile.id}`, { replace: true })
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
        <AuthContext.Provider
            value={{ user, isAuthenticated: !!user, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
