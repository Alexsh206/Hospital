import React, { createContext, useContext, useState } from 'react'
import { useNavigate }         from 'react-router-dom'
import { loginByPhoneAndPassword as loginPatient } from '../api/patients'
import { loginByPhoneAndPassword as loginStaff }   from '../api/staff'

const AuthContext = createContext(null)



export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const nav = useNavigate()

    async function login({ phone, password }) {
        // сначала пробуем залогинить пациента
        let resp = await loginPatient(phone, password).catch(() => null)
        let role = 'patient'

        if (!resp || resp.status !== 200) {
            // если не пациент — пробуем персонал
            resp = await loginStaff(phone, password).catch(() => null)
            role = 'staff'
        }

        if (resp && resp.status === 200) {
            const body = resp.data
            // body должен содержать { id, name, role }
            setUser({ id: body.id, name: body.name, role: body.role })
            // редирект в зависимости от роли
            if (body.role === 'patient') {
                nav(`/dashboard/patient/${body.id}`, { replace: true })
            } else {
                nav(`/dashboard/staff/${body.id}`, { replace: true })
            }
            return true
        }
        return false
    }

    function logout() {
        setUser(null)
        nav('/login', { replace: true })
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: Boolean(user),
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be inside AuthProvider')
    return ctx
}