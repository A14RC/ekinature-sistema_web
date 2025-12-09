const db = require('../config/db');

const controller = {
    // 1. CREAR PEDIDO 
    crearPedido: async (req, res) => {
        // recibir 'cliente'
        const { items, subtotal, iva, envio, total, descuento, cliente } = req.body; 

        // Validación de seguridad
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'El carrito está vacío' });
        }

        const connection = await db.getConnection(); 

        try {
            await connection.beginTransaction();

            // Validación de datos del cliente (Si no viene, ponemos valores por defecto)
            const nombreCliente = cliente?.nombre || 'Cliente Invitado';
            const cedulaCliente = cliente?.cedula || 'N/A';
            const direccionCliente = cliente?.direccion || 'Sin dirección';
            const telefonoCliente = cliente?.telefono || 'N/A';

            // Insertamos la Cabecera del Pedido
            const [resultPedido] = await connection.query(
                `INSERT INTO pedidos 
                (cliente_nombre, cliente_cedula, direccion, telefono, subtotal, iva, envio, descuento, total) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    nombreCliente, 
                    cedulaCliente, 
                    direccionCliente, 
                    telefonoCliente,
                    subtotal, iva, envio, descuento || 0, total
                ]
            );
            const pedidoId = resultPedido.insertId;

            // Insertamos los Detalles (Productos)
            const queriesDetalles = items.map(item => {
                return connection.query(
                    'INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                    [pedidoId, item.id, item.quantity, item.precio]
                );
            });

            await Promise.all(queriesDetalles);
            await connection.commit();

            res.status(201).json({ mensaje: 'Pedido creado exitosamente', pedidoId });

        } catch (error) {
            await connection.rollback();
            console.error('Error al crear pedido:', error);
            res.status(500).json({ error: 'Error al procesar el pedido' });
        } finally {
            connection.release();
        }
    },

    // 2. OBTENER TODOS (Para el Dashboard Principal)
    obtenerTodos: async (req, res) => {
        try {
            const [pedidos] = await db.query('SELECT * FROM pedidos ORDER BY created_at DESC');
            res.json(pedidos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener pedidos' });
        }
    },

    // 3. ACTUALIZAR ESTADO
    actualizarEstado: async (req, res) => {
        const { id } = req.params;
        const { estado } = req.body;
        try {
            await db.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, id]);
            res.json({ mensaje: 'Estado actualizado' });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar' });
        }
    },

    // 4. OBTENER DETALLES DE UN PEDIDO
    obtenerDetalles: async (req, res) => {
        const { id } = req.params;
        try {
            // Traemos los productos de ese pedido haciendo un JOIN con la tabla productos
            const [detalles] = await db.query(
                `SELECT dp.*, p.nombre, p.imagen_url 
                 FROM detalles_pedido dp 
                 JOIN productos p ON dp.producto_id = p.id 
                 WHERE dp.pedido_id = ?`, 
                [id]
            );
            res.json(detalles);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener detalles' });
        }
    }
};

module.exports = controller;