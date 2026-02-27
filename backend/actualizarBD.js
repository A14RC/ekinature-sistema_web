const db = require('./src/config/db');

const actualizar = async () => {
    try {
        await db.query('ALTER TABLE mensajes_contacto ADD COLUMN telefono VARCHAR(20) AFTER email');
        console.log('Columna "telefono" agregada con éxito a la tabla contactos.');
        process.exit(0);
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('La columna "telefono" ya existe. No es necesario hacer nada.');
        } else {
            console.error('Error al actualizar la base de datos:', error.message);
        }
        process.exit(1);
    }
};

actualizar();