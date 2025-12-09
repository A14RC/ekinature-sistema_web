const db = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function crearAdmin() {
    const connection = await db.getConnection();
    
    try {
        // DATOS DE TU USUARIO ADMIN
        const nombre = 'Admin Principal';
        const email = 'admin@ekinature.com';
        const passwordPlana = 'admin123'; // CONTRASEÑA administrador

        // 1. Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(passwordPlana, salt);

        // 2. Insertar en la base de datos
        await connection.query(
            'INSERT INTO administradores (nombre, email, password) VALUES (?, ?, ?)',
            [nombre, email, passwordEncriptada]
        );

        console.log('✅ Usuario Administrador creado con éxito.');
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Password: ${passwordPlana}`);

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.log('⚠️ El administrador ya existe. No se hicieron cambios.');
        } else {
            console.error('❌ Error al crear admin:', error);
        }
    } finally {
        connection.release(); // Liberar conexión
        process.exit(); // Cerrar el script
    }
}

crearAdmin();