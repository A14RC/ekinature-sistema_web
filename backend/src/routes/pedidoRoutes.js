const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// Rutas Públicas
router.post('/', pedidoController.crearPedido);

// Rutas de Admin (En un futuro ideal protegeríamos esto con middleware, por ahora lo dejamos abierto al admin)
router.get('/', pedidoController.obtenerTodos); // Ver lista
router.put('/:id', pedidoController.actualizarEstado); // Cambiar estado
router.get('/:id/detalles', pedidoController.obtenerDetalles); // Ver detalles de un pedido

module.exports = router;