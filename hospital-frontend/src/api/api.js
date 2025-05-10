import axios from 'axios'
import { useAuth0 } from '@auth0/auth0-react'

const API = axios.create({ baseURL: '/hospital-system/' })

export const http = axios.create({
    baseURL: '/hospital-system/',
    headers: { 'Content-Type': 'application/json' },
});

export const useApi = () => {
    const { getAccessTokenSilently } = useAuth0()
    API.interceptors.request.use(async (config) => {
        const token = await getAccessTokenSilently()
        config.headers.Authorization = `Bearer ${token}`
        return config
    })
    return API
}