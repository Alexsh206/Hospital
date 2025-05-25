import http from './http';

export const getStaff    = () => http.get('/staff');
export const getStaffById= id => http.get(`/staff/${id}`);
export const addStaff    = s  => http.post('/staff', s);
export const updateStaff = (id,s) => http.put(`/staff`, s);
export const deleteStaff = id => http.delete(`/staff`, { params:{id} });

export function loginByPhoneAndPassword(phone, password) {
    return http.post('/auth/login', { phone, password })
}