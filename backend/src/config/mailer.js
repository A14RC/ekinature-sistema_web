const nodemailer = require('nodemailer');

// Forzamos el uso del servicio 'gmail' que gestiona mejor los túneles en nubes como Render
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ocpplagas@gmail.com',
        pass: 'shfi htdy yotb ftax'
    }
});

// Verificación de conexión al arrancar (aparecerá en los logs de Render)
transporter.verify((error, success) => {
    if (error) {
        console.log("❌ Error de configuración de correo:", error.message);
    } else {
        console.log("✅ El servidor de correos está listo para enviar");
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
        html: `<div style="font-family: Arial;">
                <h2>¡Hola ${datosPedido.cliente_nombre}!</h2>
                <p>Tu pedido #${datosPedido.pedidoId} ha sido recibido.</p>
                <table style="width: 100%; border-collapse: collapse;">
                    ${productosHtml}
                </table>
                <h3>Total: $${parseFloat(datosPedido.total).toFixed(2)}</h3>
               </div>`
    };

    transporter.sendMail(mailOptions).catch(err => console.log('❌ Fallo email cliente:', err.message));
};

const enviarAlertaAdmin = (datosPedido) => {
    const mailOptions = {
        from: '"Sistema EkiNature" <ocpplagas@gmail.com>',
        to: 'ocpplagas@gmail.com',
        subject: `🛒 NUEVA ORDEN - #${datosPedido.pedidoId}`,
        text: `Nueva orden de ${datosPedido.cliente_nombre} por un total de $${datosPedido.total}`
    };
    transporter.sendMail(mailOptions).catch(err => console.log('❌ Fallo email admin:', err.message));
};

const enviarAlertaContacto = (datos) => {
    const mailOptions = {
        from: '"Sistema EkiNature" <ocpplagas@gmail.com>',
        to: 'ocpplagas@gmail.com',
        subject: `Consulta: ${datos.asunto}`,
        text: `Mensaje de ${datos.nombre} (${datos.email}): ${datos.mensaje}`
    };
    transporter.sendMail(mailOptions).catch(err => console.log('❌ Fallo email contacto:', err.message));
};

module.exports = { enviarConfirmacionPedido, enviarAlertaAdmin, enviarAlertaContacto };