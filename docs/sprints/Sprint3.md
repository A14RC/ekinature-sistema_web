Periodo: 10 Noviembre 2025 – 23 Noviembre 2025 Foco: Desarrollo del Frontend e Integración de Servicios

Se completó el desarrollo de la interfaz de usuario (Frontend) utilizando la biblioteca React, logrando una integración funcional con la API REST desarrollada previamente. El sistema ahora permite la visualización pública del catálogo de productos con una identidad visual corporativa definida.

Actividades Realizadas:

Configuración del Cliente Web: Implementación del entorno React con Vite, integrando Bootstrap para el diseño responsivo y la gestión de estilos mediante variables CSS personalizadas (Paleta Corporativa EkiNature).

Arquitectura de Componentes: Desarrollo modular de la interfaz:

Navbar.jsx: Navegación responsiva y persistente.

Home.jsx: Landing page con sección "Hero" y presentación de beneficios.

Productos.jsx: Vista de catálogo dinámico.

Consumo de API: Implementación de la capa de servicios (productService.js) utilizando Axios para gestionar la comunicación asíncrona con el Backend (Node.js/MySQL).

Renderizado Dinámico: Programación de la lógica para mapear los datos JSON provenientes de la base de datos en tarjetas de producto visuales, incluyendo la gestión de rutas de imágenes estáticas desde el directorio público.

Gestión de Rutas: Configuración de React Router para la navegación SPA (Single Page Application) sin recargas de página.