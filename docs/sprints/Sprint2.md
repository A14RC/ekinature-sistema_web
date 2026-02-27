Periodo: 27 Octubre 2025 – 09 Noviembre 2025 Foco: Desarrollo del Backend Base y Persistencia

Resumen Ejecutivo: En este sprint se construyó el núcleo del servidor y la capa de acceso a datos. El objetivo principal fue establecer una comunicación exitosa entre la aplicación y la base de datos MySQL.

Actividades Realizadas:

Configuración del Servidor: Implementación de un servidor Express.js modularizado, incluyendo middlewares de seguridad (cors) y manejo de variables de entorno (dotenv).

Conexión a Base de Datos: Desarrollo del módulo de configuración db.js utilizando un Pool de Conexiones para optimizar la interacción con MySQL.

Implementación MVC (Backend):

Modelo: Creación automatizada de la tabla productos mediante scripts de inicialización ("Code-First").

Controlador: Lógica para la recuperación de datos del catálogo.

Rutas: Exposición del endpoint GET /api/productos.

Sembrado de Datos (Seeding): Inserción de registros de prueba (Geles Insecticidas) para validar el flujo completo de información desde la BD hasta la respuesta JSON.