import { http } from './http';
export const getPatients   = () => http.get('/patients');
export const createPatient = data => http.post('/patients', data);
// src/api/patients.js




export function getPatient(id) {
    return http.get(`/patients/${id}`);
}


export function addPatient(data) {
    return http.post('/patients', data);
}


export function updatePatient(id, data) {
    return http.put(`/patients/${id}`, data);
}


export function deletePatient(id) {
    return http.delete(`/patients/${id}`);
}

