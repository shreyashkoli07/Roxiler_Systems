import API from './api';

export const adminCreateUser = (data) => API.post('/admin/users', data);
export const adminGetUsers = (params) => API.get('/admin/users', { params });
export const adminDashboard = () => API.get('/admin/dashboard');
