const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ocpplagas@gmail.com',
        pass: 'shfi htdy yotb ftax'
    }
});

const enviarConfirmacionPedido = (emailCliente, datosPedido) => {
    const mailOptions = {
        from: '"EkiNature" <tu_correo@gmail.com>',
        to: emailCliente,
        bcc: 'ocpplagas@gmail.com',
        subject: 'Confirmación de Pedido - EkiNature',
        html: `
            <div style="font-family: Arial; padding: 20px;">
                <h1 style="color: #2e7d32;">¡Pedido Recibido!</h1>
                <p>Tu orden por un total de <strong>$${datosPedido.total}</strong> está siendo procesada.</p>
                <p>Método de pago: ${datosPedido.metodo_pago}</p>
            </div>
        `
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error en envío:', error);
        } else {
            console.log('Correo enviado con éxito:', info.response);
        }
    });
};

const enviarAlertaContacto = (datos) => {
    const mailOptions = {
        from: '"Sistema EkiNature" <tu_correo@gmail.com>',
        to: 'ocpplagas@gmail.com',
        subject: `Consulta: ${datos.asunto}`,
        html: `
            <div style="border: 1px solid #2e7d32; padding: 15px;">
                <h2>Nueva Consulta de: ${datos.nombre}</h2>
                <p><strong>Email:</strong> ${datos.email}</p>
                <p><strong>Mensaje:</strong> ${datos.mensaje}</p>
            </div>
        `
    };
    transporter.sendMail(mailOptions);
};

module.exports = {
    enviarConfirmacionPedido,
    enviarAlertaContacto
};