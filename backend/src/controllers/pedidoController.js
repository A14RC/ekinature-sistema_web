const db = require('../config/db');
const { enviarConfirmacionPedido } = require('../config/mailer');

const crearPedido = async (req, res) => {
    try {
        const { cliente_nombre, cliente_cedula, direccion, telefono, subtotal, iva, total, productos, metodo_pago, email_cliente } = req.body;
        
        const queryPedido = "INSERT INTO pedidos (cliente_nombre, cliente_cedula, direccion, telefono, subtotal, iva, total, metodo_pago, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')";
        const [result] = await db.query(queryPedido, [cliente_nombre, cliente_cedula, direccion, telefono, subtotal, iva, total, metodo_pago]);
        
        const pedidoId = result.insertId;
        const queryDetalle = "INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario) VALUES ?";
        const valoresDetalle = productos.map(p => [pedidoId, p.id, p.cantidad, p.precio]);
        
        await db.query(queryDetalle, [valoresDetalle]);
        enviarConfirmacionPedido(email_cliente, { metodo_pago, total });
        
        res.json({ message: "Éxito", id: pedidoId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const obtenerPedidos = async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM pedidos ORDER BY created_at DESC");
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const obtenerKpisHoy = async (req, res) => {
    try {
        const [results] = await db.query("SELECT COUNT(*) as ventasHoy, IFNULL(SUM(total), 0) as ingresosHoy FROM pedidos WHERE DATE(created_at) = CURDATE()");
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const actualizarEstadoPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        await db.query("UPDATE pedidos SET estado = ? WHERE id = ?", [estado, id]);
        res.json({ message: "Actualizado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const eliminarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM pedidos WHERE id = ?", [id]);
        res.json({ message: "Eliminado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    crearPedido,
    obtenerPedidos,
    obtenerKpisHoy,
    actualizarEstadoPedido,
    eliminarPedido
};


