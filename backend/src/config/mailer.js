const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'ocpplagas@gmail.com',
        pass: 'shfi htdy yotb ftax'
    },
    // Forzado estricto de IPv4 y tiempos de espera
    family: 4, 
    connectionTimeout: 30000, 
    greetingTimeout: 30000,
    socketTimeout: 30000,
    dnsTimeout: 30000,
    debug: true, // Esto imprimirá más detalle en el log si algo falla
    logger: true 
});

transporter.verify((error) => {
    if (error) {
        console.log("❌ FALLO SMTP:", error.message);
    } else {
        console.log("✅ SISTEMA DE CORREOS OPERATIVO");
    }
});

const enviarConfirmacionPedido = (emailCliente, datosPedido) => {
    const mailOptions = {
        from: '"EkiNature" <ocpplagas@gmail.com>',
        to: emailCliente,
        subject: `✅ Pedido Confirmado - EkiNature #${datosPedido.pedidoId}`,
        html: `<h2>¡Hola ${datosPedido.cliente_nombre}!</h2><p>Tu pedido #${datosPedido.pedidoId} ha sido recibido.</p>`
    };
    transporter.sendMail(mailOptions).catch(err => console.log('⚠️ Error diferido:', err.message));
};

const enviarAlertaAdmin = (datosPedido) => {
    const mailOptions = {
        from: '"EkiNature System" <ocpplagas@gmail.com>',
        to: 'ocpplagas@gmail.com',
        subject: `🛒 NUEVA ORDEN - #${datosPedido.pedidoId}`,
        text: `Orden recibida por $${datosPedido.total}`
    };
    transporter.sendMail(mailOptions).catch(err => console.log('⚠️ Error admin:', err.message));
};

const enviarAlertaContacto = (datos) => {
    const mailOptions = {
        from: '"EkiNature Contacto" <ocpplagas@gmail.com>',
        to: 'ocpplagas@gmail.com',
        subject: `Consulta: ${datos.asunto}`,
        text: `Mensaje: ${datos.mensaje}`
    };
    transporter.sendMail(mailOptions).catch(err => console.log('⚠️ Error contacto:', err.message));
};

module.exports = { enviarConfirmacionPedido, enviarAlertaAdmin, enviarAlertaContacto };