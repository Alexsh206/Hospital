import React, { createContext, useContext, useState } from 'react';
import { loginByPhoneAndPassword as loginPatient } from '../api/patients'
import { loginByPhoneAndPassword as loginStaff } from '../api/staff'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function AuthProvider({children}) {
    const [user, setUser] = useState(null)
    const nav = useNavigate()

    const login = async ({ phone, password }) => {
        // сначала пробуем залогинить как пациент
        let resp = await loginPatient(phone, password).catch(() => null)
        let role = 'patient'

        if (!resp || resp.status !== 200) {
            // пробуем персонал
            resp = await loginStaff(phone, password).catch(() => null)
            role = 'staff'
        }

        if (resp && resp.status === 200) {
            const body = resp.data
            setUser({ role: body.role, id: body.id, name: body.name })
            // после установки user — делаем redirect
            if (body.role === 'patient') {
                nav(`/dashboard/patient/${body.id}`, { replace: true })
            } else {
                nav(`/dashboard/staff/${body.id}`, { replace: true })
            }
            return true
        } else {
            // не найден ни пациент, ни staff
            return false
        }
    }

    const logout = () => {
        setUser(null)
        nav('/login', { replace: true })
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)