import axios from 'axios';

export const http = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type':'application/json' }
});

export function login(phone, password) {
    return http.post('/auth/login', { phone, password });
}