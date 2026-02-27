const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Importación de Rutas
// Asegúrate de que los archivos existan en backend/src/routes/
const authRoutes = require('./routes/authRoutes');
const productoRoutes = require('./routes/productoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const contactoRoutes = require('./routes/contactoRoutes');

// Registro de Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/contacto', contactoRoutes);

// Ruta de prueba para verificar que el server responde
app.get('/', (req, res) => {
    res.send('API de EkiNature funcionando correctamente');
});

module.exports = app;