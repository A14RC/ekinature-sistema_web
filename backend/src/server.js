const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const productoRoutes = require('./routes/productoRoutes'); // <--- 1. Importamos las rutas

// Cargar variables de entorno
dotenv.config();

// Inicializar la aplicación
const app = express();

// Middlewares (Configuraciones base)
app.use(cors()); // Permite conexiones desde React
app.use(express.json()); // Permite recibir datos JSON (ej: al crear un pedido)

// Ruta de prueba inicial
app.get('/', (req, res) => {
    res.json({
        mensaje: "Bienvenido a la API de EkiNature",
        estado: "Servidor activo"
    });
});



// Usar rutas
app.use('/api/productos', productoRoutes); // <--- 2. Usamos las rutas

// Exportamos la app para usarla en el arranque
module.exports = app;