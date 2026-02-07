const express = require('express');
const router = express.Router();
const entregaController = require('../controllers/entregaController');

router.post('/agendar', entregaController.agendarEntrega);
router.get('/hoy', entregaController.obtenerEntregasHoy);

module.exports = router;