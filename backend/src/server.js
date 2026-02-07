const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const productoRoutes = require('./routes/productoRoutes'); 
const pedidoRoutes = require('./routes/pedidoRoutes');
const authRoutes = require('./routes/authRoutes');
const entregaRoutes = require('./routes/entregaRoutes');

// Cargar variables de entorno
dotenv.config();

// Inicializar la aplicación
const app = express();

// Middlewares (Configuraciones base)
app.use(cors()); // Permite conexiones desde React
app.use(express.json()); // Permite recibir datos JSON (ej: al crear un pedido)
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/productos', productoRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/entregas', entregaRoutes);



module.exports = app;