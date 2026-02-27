const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken, soloAdmin } = require('../middlewares/auth');

router.post('/login', authController.login);
router.post('/register', verificarToken, soloAdmin, authController.registrarOperador);
router.get('/operadores', verificarToken, authController.obtenerOperadores);
router.delete('/operadores/:id', verificarToken, soloAdmin, authController.eliminarOperador);

module.exports = router;