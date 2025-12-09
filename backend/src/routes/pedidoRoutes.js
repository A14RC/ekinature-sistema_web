const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// POST /api/pedidos -> Crear nuevo pedido
router.post('/', pedidoController.crearPedido);

module.exports = router;