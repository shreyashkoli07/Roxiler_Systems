import API from './api';
export const login = (payload) => API.post('/auth/login', payload);
export const register = (payload) => API.post('/auth/register', payload);
