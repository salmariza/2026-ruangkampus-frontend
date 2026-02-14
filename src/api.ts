import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:5042/api', 
  timeout: 10000, 
});

export default api;
