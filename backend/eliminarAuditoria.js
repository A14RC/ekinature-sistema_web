const db = require('./src/config/db');

const eliminarTablaAuditoria = async () => {
    try {
        await db.query('DROP TABLE IF EXISTS auditoria');
        console.log('✅ Tabla "auditoria" eliminada exitosamente.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al eliminar tabla auditoria:', error.message);
        process.exit(1);
    }
};

eliminarTablaAuditoria();
