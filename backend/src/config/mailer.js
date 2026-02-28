const nodemailer = require('nodemailer');

// Forzamos IPv4 y el puerto 587 de forma explícita
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    auth: {
        user: 'ocpplagas@gmail.com',
        pass: 'shfi htdy yotb ftax'
    },
    // CLAVE PARA RENDER: Forzar IPv4 para evitar ENETUNREACH
    family: 4 
});

transporter.verify((error) => {
    if (error) console.log("❌ Error SMTP:", error.message);
    else console.log("✅ SISTEMA DE CORREOS OPERATIVO (IPv4)");
});

const enviarConfirmacionPedido = (emailCliente, datosPedido) => {
    const mailOptions = {
        from: '"EkiNature" <ocpplagas@gmail.com>',
        to: emailCliente,
        subject: `✅ Pedido Confirmado - EkiNature #${datosPedido.pedidoId}`,
        html: `<h2>¡Hola ${datosPedido.cliente_nombre}!</h2><p>Pedido #${datosPedido.pedidoId} recibido.</p>`
    };
    transporter.sendMail(mailOptions).catch(err => console.log('Fallo mail cliente:', err.message));
};

const enviarAlertaAdmin = (datosPedido) => {
    const mailOptions = {
        from: '"EkiNature" <ocpplagas@gmail.com>',
        to: 'ocpplagas@gmail.com',
        subject: `🛒 NUEVA ORDEN - #${datosPedido.pedidoId}`,
        text: `Nueva orden de $${datosPedido.total}`
    };
    transporter.sendMail(mailOptions).catch(err => console.log('Fallo mail admin:', err.message));
};

const enviarAlertaContacto = (datos) => {
    const mailOptions = {
        from: '"EkiNature" <ocpplagas@gmail.com>',
        to: 'ocpplagas@gmail.com',
        subject: `Consulta: ${datos.asunto}`,
        text: `Mensaje: ${datos.mensaje}`
    };
    transporter.sendMail(mailOptions).catch(err => console.log('Fallo mail contacto:', err.message));
};

module.exports = { enviarConfirmacionPedido, enviarAlertaAdmin, enviarAlertaContacto };