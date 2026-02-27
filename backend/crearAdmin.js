const db = require('./src/config/db');
const bcrypt = require('bcryptjs');

const crearAdminJefe = async () => {
    const usuario = 'admin_eki';
    const passwordClaro = 'EkiNature2026'; 
    const rol = 'ADMINISTRADOR';

    try {
        const passwordHash = await bcrypt.hash(passwordClaro, 10);

        await db.query(
            'INSERT INTO usuarios (usuario, password_hash, rol) VALUES (?, ?, ?)',
            [usuario, passwordHash, rol]
        );

        console.log('Administrador Jefe creado exitosamente.');
        process.exit(0);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.error('El usuario ya existe en la base de datos.');
        } else {
            console.error('Error al crear el administrador:', error.message);
        }
        process.exit(1);
    }
};

crearAdminJefe();