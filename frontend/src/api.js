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

// Add service record
export const createServiceRecord = async (data, token) => {
  const res = await axios.post(`${API_URL}/servis`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Update altbayi info
export const updateAltBayi = async (id, data, token) => {
  const res = await axios.put(`${API_URL}/altbayi/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Make payment (update balance)
export const makePayment = async (id, amount, token) => {
  // For simplicity, fetch current altbayi, update balance by subtracting amount
  const altbayiRes = await axios.get(`${API_URL}/altbayi/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const altbayi = altbayiRes.data;
  const newBalance = (altbayi.balance || 0) - amount;
  const res = await axios.put(
    `${API_URL}/altbayi/${id}`,
    { balance: newBalance },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

// Fetch service records for altbayi
export const fetchServiceRecords = async (altBayiId, token) => {
  const res = await axios.get(`${API_URL}/servis/altbayi/${altBayiId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
