const db = require('../config/db');
const mailer = require('../config/mailer');

const pedidoController = {
    crearPedido: async (req, res) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const { cliente, productos, pago } = req.body;
            let clienteId;
            const [clienteExistente] = await connection.query('SELECT id FROM clientes WHERE email = ?', [cliente.email]);
            if (clienteExistente.length > 0) {
                clienteId = clienteExistente[0].id;
            } else {
                const [nuevoCliente] = await connection.query('INSERT INTO clientes (nombre, email, telefono, direccion) VALUES (?, ?, ?, ?)', [cliente.nombre, cliente.email, cliente.telefono, cliente.direccion]);
                clienteId = nuevoCliente.insertId;
            }
            const [nuevoPedido] = await connection.query('INSERT INTO pedidos (cliente_id, total, metodo_pago, num_comprobante) VALUES (?, ?, ?, ?)', [clienteId, pago.total, pago.metodo_pago, pago.num_comprobante]);
            const pedidoId = nuevoPedido.insertId;
            for (const item of productos) {
                const [productoBd] = await connection.query('SELECT stock, precio FROM productos WHERE id = ?', [item.id]);
                if (productoBd.length === 0 || productoBd[0].stock < item.cantidad) {
                    throw new Error(`Stock insuficiente para el producto ID: ${item.id}`);
                }
                await connection.query('UPDATE productos SET stock = stock - ? WHERE id = ?', [item.cantidad, item.id]);
                await connection.query('INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)', [pedidoId, item.id, item.cantidad, productoBd[0].precio]);
            }
            await connection.commit();

            try {
                mailer.enviarConfirmacionPedido(cliente.email, { total: pago.total, metodo_pago: pago.metodo_pago });
            } catch (mailError) {
                console.log('Error silenciado al enviar correo de pedido:', mailError);
            }

            res.status(201).json({ mensaje: 'Pedido creado exitosamente', pedidoId });
        } catch (error) {
            await connection.rollback();
            res.status(500).json({ error: error.message });
        } finally {
            connection.release();
        }
    },
    obtenerPedidos: async (req, res) => {
        try {
            const [pedidos] = await db.query(`SELECT p.id, p.total, p.metodo_pago, p.num_comprobante, p.estado, p.fecha, c.nombre AS cliente_nombre, c.email AS cliente_email, c.telefono AS cliente_telefono, c.direccion FROM pedidos p JOIN clientes c ON p.cliente_id = c.id ORDER BY p.fecha DESC`);
            res.json(pedidos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    obtenerPedidoPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const [pedido] = await db.query(`SELECT p.*, c.nombre AS cliente_nombre, c.email, c.telefono, c.direccion FROM pedidos p JOIN clientes c ON p.cliente_id = c.id WHERE p.id = ?`, [id]);
            if (pedido.length === 0) return res.status(404).json({ mensaje: 'Pedido no encontrado' });
            const [detalles] = await db.query(`SELECT d.cantidad, d.precio_unitario, pr.nombre FROM detalles_pedido d JOIN productos pr ON d.producto_id = pr.id WHERE d.pedido_id = ?`, [id]);
            res.json({ ...pedido[0], detalles });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    actualizarEstadoPedido: async (req, res) => {
        try {
            const { id } = req.params;
            const { estado } = req.body;
            await db.query('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, id]);
            res.json({ mensaje: 'Estado del pedido actualizado' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    obtenerKpisHoy: async (req, res) => {
        try {
            const [ventas] = await db.query(`SELECT COUNT(*) as ventasHoy, IFNULL(SUM(total), 0) as ingresosHoy FROM pedidos WHERE DATE(fecha) = CURDATE() AND estado != 'CANCELADO'`);
            res.json(ventas[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    eliminarPedido: async (req, res) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const { id } = req.params;
            const [detalles] = await connection.query('SELECT producto_id, cantidad FROM detalles_pedido WHERE pedido_id = ?', [id]);
            for (const item of detalles) {
                await connection.query('UPDATE productos SET stock = stock + ? WHERE id = ?', [item.cantidad, item.producto_id]);
            }
            await connection.query('DELETE FROM detalles_pedido WHERE pedido_id = ?', [id]);
            await connection.query('DELETE FROM pedidos WHERE id = ?', [id]);
            await connection.commit();
            res.json({ mensaje: 'Pedido eliminado exitosamente' });
        } catch (error) {
            await connection.rollback();
            res.status(500).json({ error: error.message });
        } finally {
            connection.release();
        }
    }
};

module.exports = pedidoController;