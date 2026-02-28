const db = require('./src/config/db');

const limpiarBaseDatos = async () => {
    try {
        console.log('🔄 Iniciando limpieza de base de datos...\n');

        // Deshabilitar constraint checks temporalmente
        await db.query('SET FOREIGN_KEY_CHECKS=0');

        // Limpiar tablas (mantiene la estructura, elimina datos)
        const tablas = [
            'auditoria',
            'detalles_pedido',
            'entregas',
            'pedidos',
            'clientes',
            'mensajes_contacto',
            'productos',
            'usuarios'
        ];

        for (const tabla of tablas) {
            try {
                await db.query(`TRUNCATE TABLE ${tabla}`);
                console.log(`✅ Tabla "${tabla}" limpiada`);
            } catch (error) {
                console.log(`⚠️  Tabla "${tabla}" no existe o no pudo limpiarse`);
            }
        }

        // Habilitar constraint checks nuevamente
        await db.query('SET FOREIGN_KEY_CHECKS=1');

        // Recrear usuario admin
        const bcrypt = require('bcryptjs');
        const passwordHash = await bcrypt.hash('EkiNature2026', 10);
        
        await db.query(
            'INSERT INTO usuarios (usuario, password_hash, rol) VALUES (?, ?, ?)',
            ['admin_eki', passwordHash, 'ADMINISTRADOR']
        );
        console.log(`✅ Usuario admin_eki recreado`);

        console.log('\n🎉 Base de datos limpiada y lista para empezar de cero!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al limpiar base de datos:', error.message);
        process.exit(1);
    }
};

limpiarBaseDatos();
