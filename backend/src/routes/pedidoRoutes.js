const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');


router.post('/', pedidoController.crearPedido);
router.get('/', pedidoController.obtenerPedidos);
router.get('/kpis/hoy', pedidoController.obtenerKpisHoy);
router.put('/:id/estado', pedidoController.actualizarEstadoPedido);
router.delete('/:id', pedidoController.eliminarPedido);

module.exports = router;