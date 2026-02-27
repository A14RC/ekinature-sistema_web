# Bitácora de Avance: Sprint 3
**Proyecto:** EkiNature-Tesis
**Periodo:** 10 Noviembre 2025 – 23 Noviembre 2025
**Módulo:** Desarrollo del Frontend e Integración de Servicios

## 1. Resumen Ejecutivo
Se completó el desarrollo de la interfaz de usuario (Cliente Web) utilizando la biblioteca **React**, logrando una integración funcional con la API REST desarrollada en el Sprint anterior. El sistema ahora permite la visualización pública del catálogo de productos con la identidad visual corporativa definida.

## 2. Actividades Técnicas Realizadas
* **Configuración del Entorno:** Inicialización del proyecto con **Vite** + **React**. Integración del framework de diseño **Bootstrap** y configuración de variables CSS globales para la paleta de colores corporativa (Verde/Crema/Dorado).
* **Arquitectura de Componentes:**
    * `Navbar.jsx`: Barra de navegación responsiva y persistente (Sticky).
    * `Home.jsx`: Landing page con sección "Hero", llamada a la acción y presentación de beneficios.
    * `Productos.jsx`: Vista del catálogo que renderiza dinámicamente tarjetas de productos.
* **Lógica de Consumo de Datos:**
    * Implementación de `productService.js` usando **Axios** para la comunicación asíncrona con el Backend.
    * Manejo de estados de carga (`Loading...`) y renderizado de imágenes dinámicas desde el directorio público.
* **Navegación:** Configuración de **React Router DOM** para gestionar las rutas (`/`, `/productos`, `/contacto`) como una SPA (Single Page Application).

## 3. Estado Final del Sprint
El módulo de visualización de productos es 100% funcional. El cliente puede navegar y ver precios y descripciones reales traídos desde la Base de Datos MySQL.