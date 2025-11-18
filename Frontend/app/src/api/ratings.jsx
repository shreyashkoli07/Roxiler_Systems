import API from './api';
export const submitRating = (data) => API.post('/ratings', data);
