const db = require('../config/db');
const mailer = require('../config/mailer');

const contactoController = {
    crearMensaje: async (req, res) => {
        try {
            const { nombre, email, telefono, asunto, mensaje } = req.body;
            
            await db.query(
                'INSERT INTO mensajes_contacto (nombre, email, telefono, asunto, mensaje) VALUES (?, ?, ?, ?, ?)', 
                [nombre, email, telefono, asunto, mensaje]
            );
            
            try {
                mailer.enviarAlertaContacto(req.body);
            } catch (mailError) {
                console.log('Error al enviar correo de contacto:', mailError);
            }

            res.status(201).json({ mensaje: 'Mensaje enviado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    obtenerMensajes: async (req, res) => {
        try {
            const [mensajes] = await db.query('SELECT * FROM mensajes_contacto ORDER BY fecha DESC');
            res.json(mensajes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    eliminarMensaje: async (req, res) => {
        try {
            const { id } = req.params;
            await db.query('DELETE FROM mensajes_contacto WHERE id = ?', [id]);
            res.json({ mensaje: 'Mensaje eliminado' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = contactoController;