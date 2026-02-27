# Bitácora de Avance: Sprint 5
**Proyecto:** EkiNature-Tesis
**Periodo:** 08 Diciembre 2025 – 21 Diciembre 2025
**Módulo:** Administración, Seguridad y Gestión de Pedidos

## 1. Resumen Ejecutivo
Se completó el desarrollo del módulo "Backoffice" (Panel de Administración), implementando medidas de seguridad robustas mediante autenticación basada en tokens (JWT). Este módulo permite al administrador gestionar el ciclo de vida de los pedidos, visualizando datos en tiempo real y modificando estados logísticos, garantizando la integridad de las transacciones comerciales.

## 2. Objetivos Alcanzados (Historias de Usuario)
* **HU10 - Autenticación de Administrador:** Implementada correctamente.
    * Login seguro con validación de credenciales contra base de datos MySQL.
    * Encriptación de contraseñas mediante **bcryptjs**.
    * Generación y validación de sesiones mediante **JSON Web Token (JWT)**.
* **HU11 - Listado y Gestión de Pedidos:** Implementada correctamente.
    * Dashboard interactivo con tabla de pedidos paginada/listada.
    * Funcionalidad para visualizar el detalle profundo de una orden (productos, cliente, dirección).
    * Control de estados: Flujo lógico `Pendiente` -> `Enviado` -> `Entregado`.

## 3. Detalles Técnicos de la Implementación
* **Backend (Node.js/Express):**
    * Se creó el middleware de seguridad y el `authController` para manejar el ingreso al sistema.
    * Se expandió el `pedidoController` para permitir operaciones de lectura global (SELECT ALL) y actualización (UPDATE), restringidas al rol de administrador.
* **Frontend (React):**
    * Desarrollo de la interfaz `Dashboard.jsx` utilizando componentes de **React Bootstrap** para una visualización de datos limpia (Tablas, Badges, Modales).
    * Implementación de Rutas Protegidas: El sistema redirige automáticamente al Login si no detecta un token válido.
    * Integración de un Modal de Detalle para consultas rápidas sin recargar la página.

## 4. Estado del Proyecto
El sistema es ahora **bifuncional**:
1.  **Lado Cliente:** Catálogo, Carrito y Checkout (Sprint 4).
2.  **Lado Admin:** Control, Seguridad y Gestión (Sprint 5).

Se da por cerrado el desarrollo del núcleo administrativo, dando paso al **Sprint 6** enfocado en la Logística de Entregas y Despliegue.