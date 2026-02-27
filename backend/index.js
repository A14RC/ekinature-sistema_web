require('dotenv').config();
const app = require('./src/server');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('-------------------------------------------');
    console.log(`🚀 Servidor EkiNature corriendo en puerto ${PORT}`);
    console.log('-------------------------------------------');
});