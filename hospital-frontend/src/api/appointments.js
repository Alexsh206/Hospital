import http  from './http';

export const getAppointments    = () => http.get('/appointments');
export const getAppointmentById = id => http.get(`/appointments/${id}`);
export const addAppointment     = a  => http.post('/appointments', a);
export const updateAppointment  = a  => http.put('/appointments', a);
export const deleteAppointment  = id => http.delete('/appointments', { params: { id } });
export const AppointmentStatus = {
    PENDING:     'Очікує',
    IN_PROGRESS: 'Обстежується',
    COMPLETED:   'Виписано',
};