const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
    login: async (req, res) => {
        try {
            const { usuario, password } = req.body;
            const [users] = await db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
            
            if (users.length === 0) {
                return res.status(401).json({ mensaje: 'Credenciales inválidas' });
            }
            
            const validPassword = await bcrypt.compare(password, users[0].password_hash);
            if (!validPassword) {
                return res.status(401).json({ mensaje: 'Credenciales inválidas' });
            }

            const token = jwt.sign(
                { id: users[0].id, rol: users[0].rol }, 
                process.env.JWT_SECRET || 'secreto_desarrollo', 
                { expiresIn: '8h' }
            );

            res.json({ token, rol: users[0].rol, usuario: users[0].usuario });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    registrarOperador: async (req, res) => {
        try {
            const { usuario, password, rol } = req.body;
            const rolFinal = rol || 'OPERADOR';
            const passwordHash = await bcrypt.hash(password, 10);

            await db.query(
                'INSERT INTO usuarios (usuario, password_hash, rol) VALUES (?, ?, ?)',
                [usuario, passwordHash, rolFinal]
            );
            
            res.status(201).json({ mensaje: 'Responsable registrado exitosamente' });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ mensaje: 'El nombre de usuario ya existe' });
            }
            res.status(500).json({ error: error.message });
        }
    },

    obtenerOperadores: async (req, res) => {
        try {
            const [operadores] = await db.query(
                'SELECT id, usuario, rol, created_at FROM usuarios WHERE usuario != "admin_eki"'
            );
            res.json(operadores);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    eliminarOperador: async (req, res) => {
        try {
            const { id } = req.params;
            await db.query('DELETE FROM usuarios WHERE id = ? AND usuario != "admin_eki"', [id]);
            res.json({ mensaje: 'Usuario eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = authController;