const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Definir la ruta GET /api/productos
router.get('/', productoController.obtenerProductos);

module.exports = router;