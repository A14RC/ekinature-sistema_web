const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // TLS requiere false en puerto 587
    auth: {
        user: 'ocpplagas@gmail.com',
        pass: 'shfi htdy yotb ftax'
    },
    tls: {
        rejectUnauthorized: false // Permite conexiones en servidores de nube
    }
});

const enviarConfirmacionPedido = (emailCliente, datosPedido) => {
    const productosHtml = datosPedido.productos.map(p => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px; text-align: left;">${p.nombre}</td>
            <td style="padding: 10px; text-align: center;">${p.cantidad}</td>
            <td style="padding: 10px; text-align: right;">$${parseFloat(p.precio).toFixed(2)}</td>
            <td style="padding: 10px; text-align: right;">$${(p.cantidad * p.precio).toFixed(2)}</td>
        </tr>
    `).join('');

    const mailOptions = {
        from: '"EkiNature" <ocpplagas@gmail.com>',
        to: emailCliente,
        subject: `✅ Pedido Confirmado - EkiNature #${datosPedido.pedidoId}`,
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
                <div style="background: #2e7d32; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
                    <h1 style="margin: 0; font-size: 28px;">¡Pedido Confirmado!</h1>
                </div>
                <div style="background: white; padding: 20px; border-radius: 0 0 5px 5px;">
                    <p>Hola <strong>${datosPedido.cliente_nombre}</strong>,</p>
                    <p>Tu pedido #${datosPedido.pedidoId} ha sido recibido.</p>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead><tr style="background: #f0f0f0;"><th>Producto</th><th>Cant</th><th>Total</th></tr></thead>
                        <tbody>${productosHtml}</tbody>
                    </table>
                    <p><strong>Total: $${parseFloat(datosPedido.total).toFixed(2)}</strong></p>
                </div>
            </div>
        `
    };
    
    // Lo enviamos sin "await" o bloqueos para que el servidor no de timeout
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