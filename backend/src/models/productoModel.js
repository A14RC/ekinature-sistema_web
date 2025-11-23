const db = require('../config/db');

const Producto = {
    // Metodo para crear la tabla automaticamente
    createTable: async () => {
        const query = `
            CREATE TABLE IF NOT EXISTS productos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                descripcion TEXT,
                precio DECIMAL(10, 2) NOT NULL,
                stock INT DEFAULT 0,
                imagen_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        try {
            await db.query(query);
            console.log('Tabla productos verificada/creada exitosamente');
        } catch (error) {
            console.error('Error al crear tabla productos:', error);
        }
    },

    // Metodo para obtener todos los productos
    getAll: async () => {
        const query = 'SELECT * FROM productos';
        const [rows] = await db.query(query);
        return rows;
    }
};

module.exports = Producto;