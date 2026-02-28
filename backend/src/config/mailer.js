const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ocpplagas@gmail.com',
        pass: 'shfi htdy yotb ftax'
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.log("❌ ERROR CRÍTICO EN MAILER:", error.message);
    } else {
        console.log("✅ SISTEMA DE CORREOS OPERATIVO");
    }
});

const enviarConfirmacionPedido = (emailCliente, datosPedido) => {
    const productosHtml = datosPedido.productos.map(p => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px;">${p.nombre}</td>
            <td style="padding: 10px; text-align: center;">${p.cantidad}</td>
            <td style="padding: 10px; text-align: right;">$${parseFloat(p.precio).toFixed(2)}</td>
        </tr>
    `).join('');

    const mailOptions = {
        from: '"EkiNature" <ocpplagas@gmail.com>',
        to: emailCliente,
        subject: `✅ Pedido Confirmado - EkiNature #${datosPedido.pedidoId}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2e7d32;">¡Hola ${datosPedido.cliente_nombre}!</h2>
                <p>Tu pedido #${datosPedido.pedidoId} ha sido recibido correctamente.</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead><tr style="background: #f0f0f0;"><th>Producto</th><th>Cant</th><th>Total</th></tr></thead>
                    <tbody>${productosHtml}</tbody>
                </table>
                <p><strong>Total: $${parseFloat(datosPedido.total).toFixed(2)}</strong></p>
            </div>
        `
    };
    transporter.sendMail(mailOptions).catch(err => console.log('Error mail cliente:', err.message));
};

const enviarAlertaAdmin = (datosPedido) => {
    const mailOptions = {
        from: '"Sistema EkiNature" <ocpplagas@gmail.com>',
        to: 'ocpplagas@gmail.com',
        subject: `🛒 NUEVA ORDEN RECIBIDA - #${datosPedido.pedidoId}`,
        text: `Nueva orden de ${datosPedido.cliente_nombre} por $${datosPedido.total}`
    };
    transporter.sendMail(mailOptions).catch(err => console.log('Error mail admin:', err.message));
};

const enviarAlertaContacto = (datos) => {
    const mailOptions = {
        from: '"Sistema EkiNature" <ocpplagas@gmail.com>',
        to: 'ocpplagas@gmail.com',
        subject: `Consulta: ${datos.asunto}`,
        text: `Mensaje de ${datos.nombre}: ${datos.mensaje}`
    };
    transporter.sendMail(mailOptions).catch(err => console.log('Error mail contacto:', err.message));
};

module.exports = { enviarConfirmacionPedido, enviarAlertaAdmin, enviarAlertaContacto };