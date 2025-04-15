import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com',
});

export const fetchTodos = async () => {
  const { data } = await api.get('/todos');
  return data;
};

export default api;
