import React, { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginByPhoneAndPassword as loginPatient } from '../api/patients'
import { loginByPhoneAndPassword as loginStaff }   from '../api/staff'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    async function login({ phone, password }) {
        // Пробуем сначала как пациент
        let resp = await loginPatient(phone, password).catch(() => null)
        let role = 'patient'

        if (!resp || resp.status !== 200) {
            // Если не пациент — как персонал
            resp = await loginStaff(phone, password).catch(() => null)
            role = 'staff'
        }

        if (resp && resp.status === 200) {
            const body = resp.data
            setUser({ id: body.id, name: body.name, role: body.role })

            if (body.role === 'patient') {
                navigate(`/dashboard/patient/${body.id}`, { replace: true })
            } else {
                navigate(`/dashboard/staff/${body.id}`, { replace: true })
            }
            return true
        }

        return false
    }

    function logout() {
        setUser(null)
        navigate('/login', { replace: true })
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return ctx
}
