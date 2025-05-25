import axios from 'axios'

// Всі запити прокидуються на /api
const http = axios.create({
    baseURL: '/api',
})

// Кожен запит підставляє Bearer-токен, якщо він є в localStorage
http.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => Promise.reject(error)
)

export default http
