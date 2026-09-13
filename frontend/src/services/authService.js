// src/services/authService.js

import axios from 'axios';

const API_URL = 'http://localhost:8000/api/'; // Replace with your actual API URL

// Example function for user login
export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}login/`, { username, password });
  return response.data;
};

// Add more authentication functions as needed
