import { api } from './http';
export const fetchAppointments = () => api.get('/api/appointments');
export const createAppointment = data => api.post('/api/appointments', data);
// …
