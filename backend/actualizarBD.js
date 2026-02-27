const db = require('./src/config/db');

const actualizar = async () => {
    try {
        await db.query('ALTER TABLE mensajes_contacto ADD COLUMN telefono VARCHAR(20) AFTER email');
        console.log('Columna "telefono" agregada con éxito a la tabla contactos.');
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('La columna "telefono" ya existe. No es necesario hacer nada.');
        } else {
            console.error('Error al actualizar la base de datos:', error.message);
            process.exit(1);
        }
    }

    try {
        await db.query('ALTER TABLE mensajes_contacto ADD COLUMN leido TINYINT(1) DEFAULT 0 AFTER mensaje');
        console.log('Columna "leido" agregada con éxito a la tabla mensajes_contacto.');
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('La columna "leido" ya existe. No es necesario hacer nada.');
        } else {
            console.error('Error al agregar columna leido:', error.message);
            process.exit(1);
        }
    }

    // ensure pedidos.estado can hold our three state names
    try {
        await db.query('ALTER TABLE pedidos MODIFY COLUMN estado VARCHAR(20) DEFAULT "PENDIENTE"');
        console.log('Columna "estado" en pedidos ajustada a VARCHAR(20).');
    } catch (error) {
        console.error('Error al modificar columna estado en pedidos:', error.message);
        process.exit(1);
    }

    // ensure usuarios.rol can hold ADMINISTRADOR and OPERADOR
    try {
        await db.query('ALTER TABLE usuarios MODIFY COLUMN rol VARCHAR(20) DEFAULT "OPERADOR"');
        console.log('Columna "rol" en usuarios ajustada a VARCHAR(20).');
    } catch (error) {
        console.error('Error al modificar columna rol en usuarios:', error.message);
        process.exit(1);
    }

    process.exit(0);
};

actualizar();