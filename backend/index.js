const app = require('./src/server.js');
const db = require('./src/config/db.js');
// Importar el modelo
const Producto = require('./src/models/productoModel.js');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await db.query('SELECT 1');
        console.log('Base de datos MySQL conectada exitosamente');

        // Inicializar tablas
        await Producto.createTable();

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });

    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
    }
};

startServer();