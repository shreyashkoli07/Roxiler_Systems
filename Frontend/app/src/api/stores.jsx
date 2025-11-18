import API from './api';
export const getStores = (params) => API.get('/stores', { params });
export const createStore = (data) => API.post('/stores', data);
export const getStoreRatings = (id) => API.get(`/stores/${id}/ratings`);
