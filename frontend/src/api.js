import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const login = async (email, password) => {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password });
  return res.data;
};

export const register = async (user) => {
  const res = await axios.post(`${API_URL}/auth/register`, user);
  return res.data;
};

export const getUsers = async (token) => {
  const res = await axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
// Diğer API fonksiyonları (cari, servis, garanti, satış, sipariş) ileride eklenecek
