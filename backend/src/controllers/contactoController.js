const db = require('../config/db');
const { enviarAlertaContacto } = require('../config/mailer');

const registrarMensaje = async (req, res) => {
    try {
        const { nombre, email, asunto, mensaje } = req.body;
        const query = "INSERT INTO mensajes_contacto (nombre, email, asunto, mensaje) VALUES (?, ?, ?, ?)";
        await db.query(query, [nombre, email, asunto, mensaje]);
        
        enviarAlertaContacto({ nombre, email, asunto, mensaje });

        res.json({ message: "Mensaje enviado y notificado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const obtenerMensajes = async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM mensajes_contacto ORDER BY fecha DESC");
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const eliminarMensaje = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM mensajes_contacto WHERE id = ?", [id]);
        res.json({ message: "Mensaje eliminado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { registrarMensaje, obtenerMensajes, eliminarMensaje };