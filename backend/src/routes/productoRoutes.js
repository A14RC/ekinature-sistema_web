const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// GET /api/productos
router.get('/', productoController.obtenerProductos);

module.exports = router;