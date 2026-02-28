const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Requerido para carpetas
const dotenv = require('dotenv');

const authRoutes = require('./src/routes/authRoutes');
const productoRoutes = require('./src/routes/productoRoutes');
const pedidoRoutes = require('./src/routes/pedidoRoutes');
const contactoRoutes = require('./src/routes/contactoRoutes');
const entregaRoutes = require('./src/routes/entregaRoutes');

dotenv.config();

const app = express();

// --- BLOQUE CRÍTICO PARA PRODUCCIÓN ---
// Crea la carpeta uploads si no existe al iniciar el servidor
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
// ---------------------------------------

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/contacto', contactoRoutes);
app.use('/api/entregas', entregaRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor de EkiNature corriendo en el puerto ${PORT}`);
});