const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Crear carpeta uploads de forma segura antes de cargar rutas
const uploadDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Carga del mailer con verificación integrada
console.log('Iniciando configuración de Mailer...');
require('./src/config/mailer');

const authRoutes = require('./src/routes/authRoutes');
const productoRoutes = require('./src/routes/productoRoutes');
const pedidoRoutes = require('./src/routes/pedidoRoutes');
const contactoRoutes = require('./src/routes/contactoRoutes');
const entregaRoutes = require('./src/routes/entregaRoutes');

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(uploadDir));

app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/contacto', contactoRoutes);
app.use('/api/entregas', entregaRoutes);

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`✅ Servidor de EkiNature corriendo en el puerto ${PORT}`);
});