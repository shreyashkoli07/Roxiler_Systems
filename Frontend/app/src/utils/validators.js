export const nameValid = s => !!s && s.length >= 20 && s.length <= 60;
export const addressValid = s => !s || s.length <= 400;
export const passwordValid = s => /^(?=.{8,16}$)(?=.*[A-Z])(?=.*[^A-Za-z0-9]).*$/.test(s);
export const emailValid = s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
