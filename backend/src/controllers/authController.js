const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const controller = {
    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            const connection = await db.getConnection();
            
            // 1. Buscar si el email existe
            const [users] = await connection.query(
                'SELECT * FROM administradores WHERE email = ?', 
                [email]
            );
            connection.release();

            if (users.length === 0) {
                return res.status(401).json({ error: 'Credenciales inválidas (Usuario no encontrado)' });
            }

            const admin = users[0];

            // 2. Comparar la contraseña ingresada con la encriptada
            const validPassword = await bcrypt.compare(password, admin.password);

            if (!validPassword) {
                return res.status(401).json({ error: 'Credenciales inválidas (Contraseña incorrecta)' });
            }

            // 3. ¡Éxito! Generar el Token (La "Llave Digital")
            // Este token expira en 2 horas
            const token = jwt.sign(
                { id: admin.id, nombre: admin.nombre }, 
                process.env.JWT_SECRET || 'secreto_temporal', 
                { expiresIn: '2h' }
            );

            res.json({
                mensaje: 'Bienvenido al Panel de Control',
                token: token,
                usuario: { nombre: admin.nombre, email: admin.email }
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }
};

module.exports = controller;