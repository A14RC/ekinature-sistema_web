const db = require('../config/db');

const contactoController = {
    crearMensaje: async (req, res) => {
        try {
            const { nombre, email, telefono, asunto, mensaje } = req.body;
            await db.query('INSERT INTO contactos (nombre, email, telefono, asunto, mensaje) VALUES (?, ?, ?, ?, ?)', [nombre, email, telefono, asunto, mensaje]);
            res.status(201).json({ mensaje: 'Mensaje enviado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    obtenerMensajes: async (req, res) => {
        try {
            const [mensajes] = await db.query('SELECT * FROM contactos ORDER BY fecha DESC');
            res.json(mensajes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    eliminarMensaje: async (req, res) => {
        try {
            const { id } = req.params;
            await db.query('DELETE FROM contactos WHERE id = ?', [id]);
            res.json({ mensaje: 'Mensaje eliminado' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = contactoController;