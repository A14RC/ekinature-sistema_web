import axios from 'axios';

// URL base de tu backend (asegurate que coincida con tu puerto de Node)
const API_URL = 'http://localhost:3000/api/productos';

const productService = {
  // Función para obtener todos los geles
  getAll: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      throw error;
    }
  }
};

export default productService;