const express = require('express');
const router = express.Router();
const contactoController = require('../controllers/contactoController');

router.post('/', contactoController.registrarMensaje);
router.get('/', contactoController.obtenerMensajes);
router.delete('/:id', contactoController.eliminarMensaje);

module.exports = router;