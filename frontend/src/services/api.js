import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:10000/api', // ajusta conforme necessário
});

export default api;
