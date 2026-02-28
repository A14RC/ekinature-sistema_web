const nodemailer = require('nodemailer');

// Usamos una configuración optimizada para entornos de nube
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // STARTTLS
    auth: {
        user: 'ocpplagas@gmail.com',
        pass: 'shfi htdy yotb ftax'
    },
    // Aumentamos los tiempos de espera para evitar el timeout en Render
    connectionTimeout: 20000, 
    greetingTimeout: 20000,
    socketTimeout: 20000,
    family: 4, // Forzamos IPv4 (Vital para evitar el error ENETUNREACH)
    pool: true // Mantiene la conexión abierta para mayor velocidad
});

transporter.verify((error) => {
    if (error) {
        console.log("❌ Error SMTP (Reintentando...):", error.message);
    } else {
        console.log("✅ SISTEMA DE CORREOS CONECTADO CON ÉXITO");
    }
});

const enviarConfirmacionPedido = (emailCliente, datosPedido) => {
    const mailOptions = {
        from: '"EkiNature" <ocpplagas@gmail.com>',
        to: emailCliente,
        subject: `✅ Pedido Confirmado - EkiNature #${datosPedido.pedidoId}`,
        html: `<h2>¡Hola ${datosPedido.cliente_nombre}!</h2><p>Tu pedido #${datosPedido.pedidoId} ha sido recibido.</p>`
    };
    // No usamos await aquí para que no bloquee el flujo si la red está lenta
    transporter.sendMail(mailOptions).catch(err => console.log('⚠️ Fallo diferido mail cliente:', err.message));
};

const enviarAlertaAdmin = (datosPedido) => {
    const mailOptions = {
        from: '"EkiNature System" <ocpplagas@gmail.com>',
        to: 'ocpplagas@gmail.com',
        subject: `🛒 NUEVA ORDEN - #${datosPedido.pedidoId}`,
        text: `Se recibió una orden por $${datosPedido.total}`
    };
    transporter.sendMail(mailOptions).catch(err => console.log('⚠️ Fallo diferido mail admin:', err.message));
};

const enviarAlertaContacto = (datos) => {
    const mailOptions = {
        from: '"EkiNature Contacto" <ocpplagas@gmail.com>',
        to: 'ocpplagas@gmail.com',
        subject: `Consulta: ${datos.asunto}`,
        text: `Mensaje: ${datos.mensaje}`
    };
    transporter.sendMail(mailOptions).catch(err => console.log('⚠️ Fallo diferido mail contacto:', err.message));
};

module.exports = { enviarConfirmacionPedido, enviarAlertaAdmin, enviarAlertaContacto };