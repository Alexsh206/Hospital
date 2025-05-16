import { http } from './http';
export const getPatients    = ()    => http.get('/patients')


export const getPatientById = id  => http.get(`/patients/${id}`)


export const addPatient     = data => http.post('/patients', data)


export const updatePatient  = (id, data) => http.put(`/patients/${id}`, data)


export const deletePatient  = id   => http.delete('/patients', { params: { id } })