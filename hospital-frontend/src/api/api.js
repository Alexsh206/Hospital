import http from './http'

export function login({ phone, password }) {
    return http.post('/auth/login', { phone, password })
}

export function getProfile() {
    return http.get('/auth/profile')
}

export function register(data) {
    return http.post('/auth/register', data);
}

export function getAllPatients() {
    return http.get('/patients')
}

export function getPatientById(id) {
    return http.get(`/patients/${id}`)
}

export function addPatient(data) {
    return http.post('/patients', data)
}

export function updatePatient(id, data) {
    return http.put(`/patients/${id}`, data)
}

export function deletePatient(id) {
    return http.delete(`/patients?id=${id}`);
}

export function getAllStaff() {
    return http.get('/staff')
}

export function getStaffById(id) {
    return http.get(`/staff/${id}`)
}

export function addStaff(data) {
    return http.post('/staff', data)
}

export function updateStaff(id, data) {
    return http.put(`/staff/${id}`, data)
}

export function deleteStaff(id) {
    return http.delete(`/staff/${id}`)
}

export function getAllAppointments() {
    return http.get('/appointments')
}

export function getAppointmentById(id) {
    return http.get(`/appointments/${id}`)
}

export function addAppointment(data) {
    return http.post('/appointments', data)
}

export function updateAppointment(id, data) {
    return http.put(`/appointments/${id}`, data)
}

export function deleteAppointment(id) {
    return http.delete(`/appointments/${id}`)
}

