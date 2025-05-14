import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { http } from '../api/http'; // axios.create({ baseURL: '/api', ... })

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });
    const navigate = useNavigate();

    const login = async ({ phone, password }) => {
        try {
            const resp = await http.post('/auth/login', { phone, password });
            const { role, id, name, position } = resp.data;
            const u = { role, id, name, position };
            setUser(u);
            localStorage.setItem('user', JSON.stringify(u));

            // редіректимо лише тут
            if (role === 'patient') {
                navigate(`/dashboard/patient/${id}`, { replace: true });
            } else {
                navigate(`/dashboard/staff/${id}`, { replace: true });
            }
            return true;
        } catch (e) {
            console.error('Login error', e);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);