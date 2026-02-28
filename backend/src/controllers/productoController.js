const db = require('../config/db');
const fs = require('fs');
const path = require('path');

const productoController = {
    obtenerProductos: async (req, res) => {
        try {
            const [productos] = await db.query('SELECT * FROM productos ORDER BY created_at DESC');
            res.json(productos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    obtenerProductoPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const [producto] = await db.query('SELECT * FROM productos WHERE id = ?', [id]);
            if (producto.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
            res.json(producto[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    crearProducto: async (req, res) => {
        try {
            const { nombre, descripcion, precio, stock } = req.body;
            const imagen_url = req.file ? `/uploads/${req.file.filename}` : null;
            const [resultado] = await db.query('INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url) VALUES (?, ?, ?, ?, ?)', [nombre, descripcion, precio, stock || 0, imagen_url]);
            res.status(201).json({ mensaje: 'Producto creado exitosamente', id: resultado.insertId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    actualizarProducto: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, descripcion, precio, stock } = req.body;
            const [productoActual] = await db.query('SELECT imagen_url FROM productos WHERE id = ?', [id]);
            if (productoActual.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
            
            let imagen_url = productoActual[0].imagen_url;
            if (req.file) {
                imagen_url = `/uploads/${req.file.filename}`;
                if (productoActual[0].imagen_url) {
                    const rutaImagenAnterior = path.join(__dirname, '../../', productoActual[0].imagen_url);
                    if (fs.existsSync(rutaImagenAnterior)) {
                        fs.unlinkSync(rutaImagenAnterior);
                    }
                }
            }
            await db.query('UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, imagen_url = ? WHERE id = ?', [nombre, descripcion, precio, stock, imagen_url, id]);
            res.json({ mensaje: 'Producto actualizado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    eliminarProducto: async (req, res) => {
        try {
            const { id } = req.params;
            const [uso] = await db.query('SELECT COUNT(*) as count FROM detalles_pedido WHERE producto_id = ?', [id]);
            if (uso[0].count > 0) {
                return res.status(400).json({ error: 'No se puede eliminar: El producto está en pedidos existentes. Edite el stock a 0.' });
            }
            const [productoActual] = await db.query('SELECT imagen_url FROM productos WHERE id = ?', [id]);
            if (productoActual.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
            
            if (productoActual[0].imagen_url) {
                const rutaImagenAnterior = path.join(__dirname, '../../', productoActual[0].imagen_url);
                if (fs.existsSync(rutaImagenAnterior)) {
                    fs.unlinkSync(rutaImagenAnterior);
                }
            }
            await db.query('DELETE FROM productos WHERE id = ?', [id]);
            res.json({ mensaje: 'Producto eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = productoController;