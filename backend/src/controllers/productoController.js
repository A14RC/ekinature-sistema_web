const Producto = require('../models/productoModel');

const controller = {
    // Obtener todos los productos
    obtenerProductos: async (req, res) => {
        try {
            const productos = await Producto.getAll();
            res.json(productos);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

module.exports = controller;