import http from './http';

export const getAdministration = () => http.get('administration');
export const getAdministrationById = id => http.get(`/administrations/${id}`);
export const getAllAdministrators = () => http.get('administration');