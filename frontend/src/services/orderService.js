import axios from 'axios';

const API_URL = 'http://localhost:3000/api/pedidos';

const orderService = {
  // --- CLIENTE: Crear Pedido ---
  createOrder: async (orderData) => {
    try {
      const response = await axios.post(API_URL, orderData);
      return response.data;
    } catch (error) {
      console.error("Error al crear el pedido:", error);
      throw error;
    }
  },

  // --- ADMIN: Listar Todos ---
  getAllOrders: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      throw error;
    }
  },

  // --- ADMIN: Actualizar Estado ---
  updateStatus: async (id, nuevoEstado) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, { estado: nuevoEstado });
      return response.data;
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      throw error;
    }
  },

  // --- ADMIN: Ver Detalles (HU11) ---
  getOrderDetails: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}/detalles`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener detalles:", error);
      throw error;
    }
  }
};

export default orderService;