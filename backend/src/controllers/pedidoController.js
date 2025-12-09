const db = require('../config/db');

const controller = {
    crearPedido: async (req, res) => {
        // AHORA RECIBO EL DESGLOSE COMPLETO
        const { items, subtotal, iva, envio, total, descuento } = req.body; 

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'El carrito está vacío' });
        }

        const connection = await db.getConnection(); 

        try {
            await connection.beginTransaction();

            // 1. Insertar la cabecera CON TODOS LOS DATOS FINANCIEROS
            const [resultPedido] = await connection.query(
                'INSERT INTO pedidos (subtotal, iva, envio, descuento, total) VALUES (?, ?, ?, ?, ?)',
                [subtotal, iva, envio, descuento || 0, total]
            );
            const pedidoId = resultPedido.insertId;

            // 2. Insertar detalles 
            const queriesDetalles = items.map(item => {
                return connection.query(
                    'INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                    [pedidoId, item.id, item.quantity, item.precio]
                );
            });

            await Promise.all(queriesDetalles);
            await connection.commit();

            res.status(201).json({ mensaje: 'Pedido creado', pedidoId });

        } catch (error) {
            await connection.rollback();
            console.error('Error al crear pedido:', error);
            res.status(500).json({ error: 'Error al procesar el pedido' });
        } finally {
            connection.release();
        }
    }
};

module.exports = controller;