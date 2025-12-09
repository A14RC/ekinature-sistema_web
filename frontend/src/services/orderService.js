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
  }
};

export default orderService;