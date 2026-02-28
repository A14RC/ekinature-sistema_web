const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Asegurar carpeta uploads al puro inicio
const uploadDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Forzar carga del mailer
require('./src/config/mailer');

const authRoutes = require('./src/routes/authRoutes');
const productoRoutes = require('./src/routes/productoRoutes');
const pedidoRoutes = require('./src/routes/pedidoRoutes');
const contactoRoutes = require('./src/routes/contactoRoutes');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/contacto', contactoRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`✅ SERVIDOR ONLINE EN PUERTO ${PORT}`);
});