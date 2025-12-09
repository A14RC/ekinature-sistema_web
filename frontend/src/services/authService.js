import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      
      // Si la respuesta tiene un token, guarda en el navegador
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.usuario));
      }
      
      return response.data;
    } catch (error) {
      console.error("Error en login:", error.response?.data?.error || error.message);
      throw error; // Lanzamos el error para que la pantalla lo muestre
    }
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('adminUser'));
  },
  
  isAuthenticated: () => {
      return !!localStorage.getItem('adminToken');
  }
};

export default authService;