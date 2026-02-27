Periodo: 24 Noviembre 2025 – 07 Diciembre 2025 (Cierre efectivo: 09 Dic) Foco: Lógica de Negocio, Carrito de Compras y Procesamiento de Pedidos

Resumen Ejecutivo: Durante este ciclo se implementó la lógica transaccional del sistema E-commerce. Se desarrolló un sistema de gestión de estado global para el carrito de compras y se habilitó la persistencia de pedidos en la base de datos, permitiendo cerrar el ciclo completo de venta desde la selección de productos hasta el registro de la orden.

Actividades Realizadas:

Gestión de Estado Global (Context API): Implementación de CartContext en React para manejar la persistencia del carrito de compras en toda la aplicación y almacenamiento local (localStorage) para evitar pérdida de datos al recargar.

Interfaz de Usuario (Carrito):

Diseño y programación de la vista Carrito.jsx con tablas dinámicas.

Implementación de lógica visual para cálculo de subtotales, IVA y totales en tiempo real.

Funcionalidades de interacción: Aumentar/Disminuir cantidad y eliminar ítems.

Backend Transaccional:

Diseño del modelo de datos relacional: tablas pedidos (cabecera) y detalles_pedido (renglones).

Desarrollo del controlador pedidoController.js utilizando Transacciones SQL (beginTransaction, commit, rollback) para garantizar la integridad de los datos al guardar órdenes complejas.

Exposición del endpoint POST /api/pedidos.

Integración Full-Stack: Conexión del botón "Finalizar Compra" del Frontend con la API del Backend mediante el servicio orderService.js, logrando el registro exitoso de ventas.