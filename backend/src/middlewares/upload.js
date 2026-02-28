const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Usamos path.resolve para asegurar que encuentre la carpeta en Render
const uploadPath = path.resolve(__dirname, '../../uploads');

// Seguridad extra: Si por alguna razón la carpeta no existe, Multer la crea
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Límite 5MB
});

module.exports = upload;