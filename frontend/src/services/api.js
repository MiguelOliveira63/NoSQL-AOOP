import axios from 'axios';

const api = axios.create({
  baseURL: 'https://nosql-aoop.onrender.com/api',
});

export default api;
