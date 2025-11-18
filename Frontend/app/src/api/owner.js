import API from './api';

export const getOwnerRatings = (ownerId) =>
  API.get(`/owner/${ownerId}/ratings`);
