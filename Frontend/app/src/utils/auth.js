import { jwtDecode } from 'jwt-decode';

export const saveToken = token => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const removeToken = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); };

export const saveUser = (user) => localStorage.setItem('user', JSON.stringify(user));
export const getUser = () => { try { return JSON.parse(localStorage.getItem('user')) } catch { return null } };

export const decodeToken = () => {
  const token = getToken();
  if (!token) return null;
  try { return jwtDecode(token); } catch { return null; }
};

export const getRole = () => {
  const u = getUser(); if (u?.role) return u.role;
  const d = decodeToken(); return d?.role || null;
};
