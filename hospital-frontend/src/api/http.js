import axios from 'axios'

export const http = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' }
})

http.interceptors.request.use(config => {
    const t = localStorage.getItem('token')
    if (t) config.headers.Authorization = `Bearer ${t}`
    return config
})
