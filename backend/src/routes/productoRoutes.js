const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const upload = require('../middlewares/upload');

router.get('/', productoController.obtenerProductos);
router.get('/:id', productoController.obtenerProductoPorId);
router.post('/', upload.single('imagen'), productoController.crearProducto);
router.put('/:id', upload.single('imagen'), productoController.actualizarProducto);
router.delete('/:id', productoController.eliminarProducto);

module.exports = router;