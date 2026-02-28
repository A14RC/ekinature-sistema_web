const db = require('./src/config/db');

const actualizar = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                rol VARCHAR(20) DEFAULT 'OPERADOR',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS productos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(200) NOT NULL,
                descripcion TEXT,
                precio DECIMAL(10, 2) NOT NULL,
                stock INT NOT NULL,
                imagen_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS clientes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(150) NOT NULL,
                email VARCHAR(100) NOT NULL,
                telefono VARCHAR(20),
                direccion TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS pedidos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                cliente_id INT,
                total DECIMAL(12, 2) NOT NULL,
                metodo_pago VARCHAR(50),
                num_comprobante VARCHAR(100),
                estado VARCHAR(20) DEFAULT 'PENDIENTE',
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                visto TINYINT(1) DEFAULT 0,
                FOREIGN KEY (cliente_id) REFERENCES clientes(id)
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS detalles_pedido (
                id INT AUTO_INCREMENT PRIMARY KEY,
                pedido_id INT,
                producto_id INT,
                cantidad INT NOT NULL,
                precio_unitario DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
                FOREIGN KEY (producto_id) REFERENCES productos(id)
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS mensajes_contacto (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(150) NOT NULL,
                email VARCHAR(100) NOT NULL,
                asunto VARCHAR(150),
                mensaje TEXT,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Tablas base verificadas/creadas con éxito.');

        const [colsContacto] = await db.query('SHOW COLUMNS FROM mensajes_contacto');
        const hasTelefono = colsContacto.some(c => c.Field === 'telefono');
        const hasLeido = colsContacto.some(c => c.Field === 'leido');

        if (!hasTelefono) {
            await db.query('ALTER TABLE mensajes_contacto ADD COLUMN telefono VARCHAR(20) AFTER email');
            console.log('Columna "telefono" agregada a mensajes_contacto.');
        }

        if (!hasLeido) {
            await db.query('ALTER TABLE mensajes_contacto ADD COLUMN leido TINYINT(1) DEFAULT 0 AFTER mensaje');
            console.log('Columna "leido" agregada a mensajes_contacto.');
        }

        await db.query('ALTER TABLE pedidos MODIFY COLUMN estado VARCHAR(20) DEFAULT "PENDIENTE"');
        await db.query('ALTER TABLE usuarios MODIFY COLUMN rol VARCHAR(20) DEFAULT "OPERADOR"');
        
        console.log('Estructura de base de datos actualizada y normalizada.');
        process.exit(0);
    } catch (error) {
        console.error('Error crítico en la actualización de la base de datos:', error.message);
        process.exit(1);
    }
};

actualizar();