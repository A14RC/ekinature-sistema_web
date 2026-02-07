import axios from 'axios';

const API_URL = 'http://localhost:3000/api/pedidos';

const orderService = {
  createOrder: async (orderData) => {
    try {
      const response = await axios.post(API_URL, orderData);
      return response.data;
    } catch (error) {
      console.error("Error al crear el pedido:", error);
      throw error;
    }
  },

  getAllOrders: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      throw error;
    }
  },

  updateStatus: async (id, nuevoEstado) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, { estado: nuevoEstado });
      return response.data;
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      throw error;
    }
  },

  getOrderDetails: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}/detalles`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener detalles:", error);
      throw error;
    }
  },

  // --- NUEVO: HU12 LOGÍSTICA ---
  scheduleDelivery: async (pedidoId, fecha) => {
    try {
      // Nota: Ajustamos la URL para apuntar al endpoint correcto de entregas
      const response = await axios.post(`http://localhost:3000/api/entregas/agendar`, {
        pedido_id: pedidoId,
        fecha_programada: fecha
      });
      return response.data;
    } catch (error) {
      console.error("Error al agendar:", error);
      throw error;
    }
  },

  getTodayDeliveries: async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/entregas/hoy`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener entregas de hoy:", error);
      throw error;
    }
  }
};

export default orderService;