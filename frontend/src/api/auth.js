// src/api/auth.js
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

// Get logged-in user info
export const getCurrentUser = async () => {
  const res = await axios.get(`${API_BASE}/auth/user`, { withCredentials: true });
  return res.data;
};

// Logout user
export const logoutUser = async () => {
  const res = await axios.post(`${API_BASE}/auth/logout`, {}, { withCredentials: true });
  return res.data;
};
