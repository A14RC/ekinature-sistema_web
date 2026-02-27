const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ocpplagas@gmail.com',
        pass: 'shfi htdy yotb ftax'
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
                    <p style="font-size: 16px; color: #333;">Hola <strong>${datosPedido.cliente_nombre}</strong>,</p>
                    
                    <p style="color: #666; line-height: 1.6;">Tu pedido ha sido recibido exitosamente en EkiNature y está siendo procesado. Recibirás una notificación pronto con el número de seguimiento.</p>
                    
                    <div style="background: #e8f5e9; padding: 15px; border-left: 4px solid #2e7d32; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>ID de Pedido:</strong> #${datosPedido.pedidoId}</p>
                        <p style="margin: 5px 0;"><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
                    </div>
                    
                    <h3 style="color: #2e7d32; border-bottom: 2px solid #2e7d32; padding-bottom: 10px;">Resumen de tu Orden</h3>
                    
                    <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                        <thead>
                            <tr style="background: #f0f0f0;">
                                <th style="padding: 12px; text-align: left; font-weight: bold;">Producto</th>
                                <th style="padding: 12px; text-align: center; font-weight: bold;">Cantidad</th>
                                <th style="padding: 12px; text-align: right; font-weight: bold;">P. Unitario</th>
                                <th style="padding: 12px; text-align: right; font-weight: bold;">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productosHtml}
                        </tbody>
                    </table>
                    
                    <div style="text-align: right; border-top: 2px solid #2e7d32; padding-top: 15px;">
                        <p style="font-size: 18px; color: #2e7d32;"><strong>Total: $${parseFloat(datosPedido.total).toFixed(2)}</strong></p>
                        <p style="font-size: 14px; color: #666;">Método de Pago: <strong>${datosPedido.metodo_pago}</strong></p>
                    </div>
                    
                    <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin-top: 20px;">
                        <h4 style="color: #2e7d32; margin-top: 0;">📍 Próximos Pasos</h4>
                        <ul style="color: #666; margin: 10px 0;">
                            <li>Tu pedido está siendo preparado para envío</li>
                            <li>Recibirás un email con el código de seguimiento</li>
                            <li>Puedes rastrear tu pedido en cualquier momento</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
                        <p>Si tienes dudas, contacta con nosotros a través de nuestro formulario de contacto.</p>
                        <p><strong>EkiNature</strong> - Expertos en productos ecológicos</p>
                    </div>
                </div>
            </div>
        `
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar confirmación al cliente:', error);
        } else {
            console.log('Correo de confirmación enviado al cliente:', info.response);
        }
    });
};


const enviarAlertaAdmin = (datosPedido) => {
    const productosHtml = datosPedido.productos.map(p => `
        <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px; text-align: left;">${p.nombre}</td>
            <td style="padding: 10px; text-align: center;">${p.cantidad}</td>
            <td style="padding: 10px; text-align: right;">$${parseFloat(p.precio).toFixed(2)}</td>
            <td style="padding: 10px; text-align: right;">$${(p.cantidad * p.precio).toFixed(2)}</td>
        </tr>
    `).join('');

    const mailOptions = {
        from: '"Sistema EkiNature" <ocpplagas@gmail.com>',
        to: 'ocpplagas@gmail.com',
        subject: `🛒 NUEVA ORDEN RECIBIDA - #${datosPedido.pedidoId}`,
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 700px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
                <div style="background: #c41c3b; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
                    <h1 style="margin: 0; font-size: 24px;">⚡ NUEVA ORDEN RECIBIDA</h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px; font-weight: bold;">ID: #${datosPedido.pedidoId}</p>
                </div>
                
                <div style="background: white; padding: 20px;">
                    <h2 style="color: #333; border-bottom: 2px solid #c41c3b; padding-bottom: 10px;">📋 DETALLES DE LA ORDEN</h2>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
                        <div>
                            <p style="margin: 8px 0; color: #666;"><strong>ID Pedido:</strong> #${datosPedido.pedidoId}</p>
                            <p style="margin: 8px 0; color: #666;"><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}</p>
                            <p style="margin: 8px 0; color: #666;"><strong>Estado:</strong> <span style="background: #fff3cd; color: #856404; padding: 2px 8px; border-radius: 3px; font-weight: bold;">PENDIENTE</span></p>
                        </div>
                        <div>
                            <p style="margin: 8px 0; color: #666;"><strong>Total:</strong> <span style="color: #2e7d32; font-size: 18px; font-weight: bold;">$${parseFloat(datosPedido.total).toFixed(2)}</span></p>
                            <p style="margin: 8px 0; color: #666;"><strong>Método de Pago:</strong> ${datosPedido.metodo_pago}</p>
                        </div>
                    </div>
                    
                    <h3 style="color: #333; margin-top: 20px; border-bottom: 2px solid #2e7d32; padding-bottom: 10px;">👤 INFORMACIÓN DEL CLIENTE</h3>
                    
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
                        <p style="margin: 8px 0; color: #666;"><strong>Nombre:</strong> ${datosPedido.cliente_nombre}</p>
                        <p style="margin: 8px 0; color: #666;"><strong>Email:</strong> <a href="mailto:${datosPedido.cliente_email}" style="color: #2e7d32;">${datosPedido.cliente_email}</a></p>
                        <p style="margin: 8px 0; color: #666;"><strong>Teléfono:</strong> ${datosPedido.cliente_telefono || 'No proporcionado'}</p>
                        <p style="margin: 8px 0; color: #666;"><strong>Dirección:</strong> ${datosPedido.cliente_direccion}</p>
                    </div>
                    
                    <h3 style="color: #333; margin-top: 20px; border-bottom: 2px solid #2e7d32; padding-bottom: 10px;">📦 PRODUCTOS ORDENADOS</h3>
                    
                    <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                        <thead>
                            <tr style="background: #f0f0f0;">
                                <th style="padding: 12px; text-align: left; font-weight: bold;">Producto</th>
                                <th style="padding: 12px; text-align: center; font-weight: bold;">Cantidad</th>
                                <th style="padding: 12px; text-align: right; font-weight: bold;">P. Unitario</th>
                                <th style="padding: 12px; text-align: right; font-weight: bold;">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productosHtml}
                        </tbody>
                    </table>
                    
                    <div style="text-align: right; border-top: 2px solid #c41c3b; padding-top: 15px;">
                        <p style="font-size: 18px; color: #c41c3b;"><strong>TOTAL: $${parseFloat(datosPedido.total).toFixed(2)}</strong></p>
                    </div>
                    
                    <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #c41c3b; margin-top: 20px; border-radius: 3px;">
                        <h4 style="color: #856404; margin-top: 0;">⚡ ACCIÓN REQUERIDA</h4>
                        <p style="color: #856404; margin: 10px 0;">Esta orden requiere procesamiento inmediato. Accede al panel de administración para procesar el pago, imprimir la etiqueta y gestionar el envío.</p>
                        <p style="color: #856404; margin: 10px 0;"><strong>Estado Actual: PENDIENTE DE PROCESAMIENTO</strong></p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
                        <p>Mensaje automático generado por EkiNature - No responder a este correo</p>
                    </div>
                </div>
            </div>
        `
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar alerta al admin:', error);
        } else {
            console.log('Correo de alerta enviado al admin:', info.response);
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
    enviarAlertaAdmin,
    enviarAlertaContacto
};