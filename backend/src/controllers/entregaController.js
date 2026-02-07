const db = require('../config/db');

const controller = {
    // 1. Asignar fecha de entrega
    agendarEntrega: async (req, res) => {
        const { pedido_id, fecha_programada } = req.body;

        if (!pedido_id || !fecha_programada) {
            return res.status(400).json({ error: 'Faltan datos (pedido o fecha)' });
        }

        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            // A. Crear registro en entregas
            await connection.query(
                'INSERT INTO entregas (pedido_id, fecha_programada, intento, estado) VALUES (?, ?, 1, "programado")',
                [pedido_id, fecha_programada]
            );

            // B. Actualizar estado del pedido a "enviado"
            await connection.query(
                'UPDATE pedidos SET estado = "enviado" WHERE id = ?',
                [pedido_id]
            );

            await connection.commit();
            res.status(201).json({ mensaje: 'Entrega programada exitosamente' });

        } catch (error) {
            await connection.rollback();
            console.error(error);
            res.status(500).json({ error: 'Error al programar entrega' });
        } finally {
            connection.release();
        }
    },

    // 2. Obtener entregas de HOY Y MAÑANA
    obtenerEntregasHoy: async (req, res) => {
        try {
            // Modifico el WHERE para buscar entre HOY y MAÑANA
            const query = `
                SELECT e.*, p.cliente_nombre, p.direccion, p.telefono, p.total 
                FROM entregas e
                JOIN pedidos p ON e.pedido_id = p.id
                WHERE e.fecha_programada BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 1 DAY)
                ORDER BY e.fecha_programada ASC
            `;
            const [entregas] = await db.query(query);
            res.json(entregas);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener entregas' });
        }
    }
};

module.exports = controller;