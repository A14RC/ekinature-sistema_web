const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const tokenHeader = req.header('Authorization');
    if (!tokenHeader) {
        return res.status(403).json({ mensaje: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        const token = tokenHeader.replace('Bearer ', '');
        const verificado = jwt.verify(token, process.env.JWT_SECRET || 'secreto_desarrollo');
        req.usuario = verificado;
        next();
    } catch (error) {
        res.status(401).json({ mensaje: 'Token inválido o expirado.' });
    }
};

const soloAdmin = (req, res, next) => {
    const rolUsuario = req.usuario.rol?.toUpperCase();
    if (rolUsuario !== 'ADMINISTRADOR' && rolUsuario !== 'ADMIN') {
        return res.status(403).json({ mensaje: 'Acceso denegado. Solo administradores pueden realizar esta acción.' });
    }
    next();
};

module.exports = { verificarToken, soloAdmin };