import { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Tabs, Tab, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [pedidos, setPedidos] = useState([]);
    const [mensajes, setMensajes] = useState([]);
    const [kpis, setKpis] = useState({ ventasHoy: 0, ingresosHoy: 0 });
    const [showModal, setShowModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showEditProductModal, setShowEditProductModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const navigate = useNavigate();

    const [productos, setProductos] = useState([]);
    const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', descripcion: '', precio: '', stock: '' });
    const [imagen, setImagen] = useState(null);

    const [productoAEditar, setProductoAEditar] = useState({ id: '', nombre: '', descripcion: '', precio: '', stock: '' });
    const [imagenEdicion, setImagenEdicion] = useState(null);

    const prevPedidosCount = useRef(0);
    const prevMensajesCount = useRef(0);

    const playNotificationSound = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.log("Navegador bloqueó audio automático", e));
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const resProd = await axios.get('http://localhost:3000/api/productos');
            setProductos(resProd.data);
        } catch (error) {}

        try {
            const resOrders = await axios.get('http://localhost:3000/api/pedidos');
            if (prevPedidosCount.current !== 0 && resOrders.data.length > prevPedidosCount.current) {
                playNotificationSound();
            }
            prevPedidosCount.current = resOrders.data.length;
            setPedidos(resOrders.data);
        } catch (error) {}

        try {
            const resMsgs = await axios.get('http://localhost:3000/api/contacto');
            if (prevMensajesCount.current !== 0 && resMsgs.data.length > prevMensajesCount.current) {
                playNotificationSound();
            }
            prevMensajesCount.current = resMsgs.data.length;

            // backend now returns `leido` (0/1) so convert to boolean
            const mensajesFromServer = resMsgs.data.map(m => ({
                ...m,
                leido: !!m.leido
            }));
            setMensajes(mensajesFromServer);
        } catch (error) {}

        try {
            const resKpis = await axios.get('http://localhost:3000/api/pedidos/kpis/hoy');
            setKpis(resKpis.data);
        } catch (error) {}
    };

    const handleCrearProducto = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nombre', nuevoProducto.nombre);
        formData.append('descripcion', nuevoProducto.descripcion);
        formData.append('precio', nuevoProducto.precio);
        formData.append('stock', nuevoProducto.stock);
        if (imagen) formData.append('imagen', imagen);

        try {
            await axios.post('http://localhost:3000/api/productos', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setNuevoProducto({ nombre: '', descripcion: '', precio: '', stock: '' });
            setImagen(null);
            fetchData();
        } catch (err) {
            alert("Error al crear el producto");
        }
    };

    const handleEditClick = (producto) => {
        setProductoAEditar({
            id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion || '',
            precio: producto.precio,
            stock: producto.stock
        });
        setImagenEdicion(null);
        setShowEditProductModal(true);
    };

    const handleActualizarProducto = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nombre', productoAEditar.nombre);
        formData.append('descripcion', productoAEditar.descripcion);
        formData.append('precio', productoAEditar.precio);
        formData.append('stock', productoAEditar.stock);
        if (imagenEdicion) formData.append('imagen', imagenEdicion);

        try {
            await axios.put(`http://localhost:3000/api/productos/${productoAEditar.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowEditProductModal(false);
            fetchData();
        } catch (err) {
            alert("Error al actualizar el producto");
        }
    };

    const eliminarProducto = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este producto?")) {
            try {
                await axios.delete(`http://localhost:3000/api/productos/${id}`);
                fetchData();
            } catch (err) {
                alert(err.response?.data?.error || "Error al eliminar el producto");
            }
        }
    };

    const handleUpdateStatus = async (id, nuevoEstado) => {
        const estadoMayusculas = nuevoEstado.toString().toUpperCase();
        try {
            await axios.put(`http://localhost:3000/api/pedidos/${id}/estado`, { estado: estadoMayusculas });

            // update local copy using functional setState to avoid stale closures
            setPedidos(prev => prev.map(p => 
                p.id === id ? { ...p, estado: estadoMayusculas } : p
            ));
        } catch (err) {
            console.error("Error al actualizar estado", err);
            alert(err.response?.data?.error || "No se pudo actualizar el estado");
        } finally {
            // re-fetch to ensure server/client stay in sync
            fetchData();
        }
    };

    const handleDeleteOrder = async (id) => {
        if (window.confirm("¿Eliminar pedido? Esto restará el valor de las métricas de hoy.")) {
            try {
                await axios.delete(`http://localhost:3000/api/pedidos/${id}`);
                fetchData();
            } catch (err) {
                alert("Error al eliminar el pedido");
            }
        }
    };

    const handleDeleteMessage = async (id) => {
        if (window.confirm("¿Eliminar este mensaje de contacto?")) {
            try {
                await axios.delete(`http://localhost:3000/api/contacto/${id}`);
                fetchData();
            } catch (err) {
                alert("Error al eliminar el mensaje");
            }
        }
    };

    const generateLabel = async (order) => {
        try {
            await handleUpdateStatus(order.id, 'ENVIADO');
        } catch (err) {
            // handleUpdateStatus already alerts, just prevent print
            return;
        }

        const telefonoReal = order.cliente_telefono || order.telefono || "No especificado";
        
        const printWindow = window.open('', '_blank');
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Pedido:${order.id}|Cliente:${order.cliente_nombre}|Telf:${telefonoReal}`;

        printWindow.document.write(`
            <html>
                <body style="font-family: Arial; padding: 20px; width: 350px; border: 2px dashed #2e7d32; text-align:center; color: #333;">
                    <h2 style="color:#2e7d32; margin-bottom: 5px;">EKINATURE</h2>
                    <p style="margin: 0; font-size: 12px;">GUÍA DE ENVÍO PROFESIONAL</p>
                    <hr style="border: 0.5px solid #eee; margin: 15px 0;"/>
                    <div style="text-align:left; font-size: 14px;">
                        <p><strong>DESTINATARIO:</strong> ${order.cliente_nombre}</p>
                        <p><strong>DIRECCIÓN:</strong> ${order.direccion}</p>
                        <p><strong>TELÉFONO:</strong> ${telefonoReal}</p>
                        <p><strong>ID PEDIDO:</strong> #${order.id}</p>
                    </div>
                    <div style="margin-top:20px;">
                        <img src="${qrUrl}" />
                        <p style="font-size:10px; color: #666;">Escanee para validar logística</p>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        navigate('/login');
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleViewMessage = async (message) => {
        try {
            await axios.put(`http://localhost:3000/api/contacto/${message.id}/leido`);
        } catch (err) {
            console.error('Error marcando mensaje como leído', err);
        }

        setMensajes(mensajes.map(m => 
            m.id === message.id ? { ...m, leido: true } : m
        ));

        setSelectedMessage(message);
        setShowMessageModal(true);
    };

    const pedidosPendientes = pedidos.filter(p => p.estado && p.estado.toUpperCase() === 'PENDIENTE').length;
    const mensajesNoLeidos = mensajes.filter(m => !m.leido).length;

    return (
        <Container className="my-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold" style={{ color: '#2e7d32' }}>Panel de Control EkiNature</h2>
                <Button variant="outline-danger" onClick={handleLogout} className="fw-bold">Cerrar Sesión 🚪</Button>
            </div>

            <Row className="mb-4">
                <Col md={6} className="mb-3 mb-md-0">
                    <Card className="text-center border-0 shadow-sm bg-success text-white p-3" style={{ borderRadius: '20px' }}>
                        <h5>Ventas del Día</h5>
                        <h2 className="fw-bold display-5">{kpis.ventasHoy}</h2>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="text-center border-0 shadow-sm p-3" style={{ borderRadius: '20px', backgroundColor: '#e8f5e9' }}>
                        <h5 style={{ color: '#2e7d32' }}>Ingresos Hoy</h5>
                        <h2 className="fw-bold display-5" style={{ color: '#1b5e20' }}>
                            ${parseFloat(kpis.ingresosHoy || 0).toFixed(2)}
                        </h2>
                    </Card>
                </Col>
            </Row>

            <Tabs defaultActiveKey="inventario" className="mb-4 custom-tabs">
                <Tab eventKey="pedidos" title={<span>🛒 Pedidos Recientes {pedidosPendientes > 0 && <Badge bg="danger" className="ms-1">{pedidosPendientes}</Badge>}</span>}>
                    <Card className="border-0 shadow-sm p-4" style={{ borderRadius: '25px' }}>
                        <Table responsive hover align="middle">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Cliente</th>
                                    <th>Total</th>
                                    <th style={{ width: '180px' }}>Estado</th>
                                    <th className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.map(p => (
                                    <tr key={p.id}>
                                        <td className="fw-bold">#{p.id}</td>
                                        <td>{p.cliente_nombre}</td>
                                        <td className="fw-bold text-success">${parseFloat(p.total).toFixed(2)}</td>
                                        <td>
                                            <Form.Select 
                                                size="sm" 
                                                value={
                                                    ['PENDIENTE','ENVIADO','CANCELADO'].includes(
                                                        p.estado?.toString().toUpperCase()
                                                    )
                                                    ? p.estado.toString().toUpperCase()
                                                    : 'PENDIENTE'
                                                }
                                                onChange={(e) => handleUpdateStatus(p.id, e.target.value)}
                                                style={{ borderRadius: '10px' }}
                                            >
                                                <option value="PENDIENTE">Pendiente</option>
                                                <option value="ENVIADO">Enviado</option>
                                                <option value="CANCELADO">Cancelado</option>
                                            </Form.Select>
                                        </td>
                                        <td className="text-center">
                                            <Button variant="link" title="Ver Detalles" onClick={() => handleViewDetails(p)}>👁️</Button>
                                            <Button variant="link" title="Imprimir Etiqueta" onClick={() => generateLabel(p)}>🏷️</Button>
                                            <Button variant="link" className="text-danger" title="Eliminar" onClick={() => handleDeleteOrder(p.id)}>🗑️</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>
                </Tab>

                <Tab eventKey="inventario" title="📦 Inventario">
                    <Card className="border-0 shadow-sm p-4" style={{ borderRadius: '25px' }}>
                        <Row>
                            <Col md={4}>
                                <div className="p-3 bg-light" style={{ borderRadius: '15px' }}>
                                    <h5 className="fw-bold mb-3">Nuevo Producto</h5>
                                    <Form onSubmit={handleCrearProducto}>
                                        <Form.Group className="mb-2">
                                            <Form.Label>Nombre</Form.Label>
                                            <Form.Control required value={nuevoProducto.nombre} onChange={e => setNuevoProducto({...nuevoProducto, nombre: e.target.value})} />
                                        </Form.Group>
                                        <Form.Group className="mb-2">
                                            <Form.Label>Precio</Form.Label>
                                            <Form.Control required type="number" step="0.01" value={nuevoProducto.precio} onChange={e => setNuevoProducto({...nuevoProducto, precio: e.target.value})} />
                                        </Form.Group>
                                        <Form.Group className="mb-2">
                                            <Form.Label>Stock</Form.Label>
                                            <Form.Control required type="number" value={nuevoProducto.stock} onChange={e => setNuevoProducto({...nuevoProducto, stock: e.target.value})} />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Imagen</Form.Label>
                                            <Form.Control type="file" onChange={e => setImagen(e.target.files[0])} />
                                        </Form.Group>
                                        <Button type="submit" className="w-100" style={{ backgroundColor: '#2e7d32', border: 'none' }}>Guardar</Button>
                                    </Form>
                                </div>
                            </Col>
                            <Col md={8}>
                                <Table responsive hover align="middle">
                                    <thead>
                                        <tr>
                                            <th>Imagen</th>
                                            <th>Nombre</th>
                                            <th>Precio</th>
                                            <th>Stock</th>
                                            <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productos.map(p => (
                                            <tr key={p.id}>
                                                <td>
                                                    {p.imagen_url && <img src={`http://localhost:3000${p.imagen_url}`} width="40" height="40" style={{ objectFit: 'cover', borderRadius: '5px' }} alt="" />}
                                                </td>
                                                <td>{p.nombre}</td>
                                                <td className="fw-bold">${p.precio}</td>
                                                <td>{p.stock}</td>
                                                <td>
                                                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditClick(p)}>✏️</Button>
                                                    <Button variant="outline-danger" size="sm" onClick={() => eliminarProducto(p.id)}>🗑️</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </Card>
                </Tab>

                <Tab eventKey="mensajes" title={<span>✉️ Mensajes {mensajesNoLeidos > 0 && <Badge bg="primary" className="ms-1">{mensajesNoLeidos}</Badge>}</span>}>
                    <Card className="border-0 shadow-sm p-4" style={{ borderRadius: '25px' }}>
                        <Table responsive hover align="middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Fecha</th>
                                    <th>Nombre</th>
                                    <th>Asunto</th>
                                    <th className="text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mensajes.map(m => (
                                    <tr key={m.id} style={!m.leido ? { fontWeight: 'bold', backgroundColor: '#f8f9fa' } : {}}>
                                        <td>{new Date(m.fecha).toLocaleDateString()}</td>
                                        <td>{m.nombre}</td>
                                        <td className="text-muted">{m.asunto}</td>
                                        <td className="text-center">
                                            <Button variant="link" title="Ver Mensaje" onClick={() => handleViewMessage(m)}>👁️</Button>
                                            <Button variant="link" className="text-danger" title="Eliminar" onClick={() => handleDeleteMessage(m.id)}>🗑️</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        {mensajes.length === 0 && <p className="text-center text-muted mt-3">No hay mensajes nuevos.</p>}
                    </Card>
                </Tab>
            </Tabs>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton style={{ border: 'none' }}>
                    <Modal.Title className="fw-bold" style={{ color: '#2e7d32' }}>
                        Detalles del Pedido #{selectedOrder?.id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-light mx-3 mb-3" style={{ borderRadius: '15px' }}>
                    {selectedOrder && (
                        <div className="p-2">
                            <p className="mb-2"><strong>Cliente:</strong> {selectedOrder.cliente_nombre}</p>
                            <p className="mb-2"><strong>Email:</strong> {selectedOrder.cliente_email}</p>
                            <p className="mb-2"><strong>Teléfono:</strong> {selectedOrder.cliente_telefono || selectedOrder.telefono}</p>
                            <p className="mb-2"><strong>Comprobante:</strong> <Badge bg="info">{selectedOrder.num_comprobante}</Badge></p>
                            <p className="mb-2"><strong>Dirección:</strong> {selectedOrder.direccion}</p>
                            <p className="mb-2"><strong>Método de Pago:</strong> {selectedOrder.metodo_pago}</p>
                            <hr/>
                            <h4 className="text-end fw-bold" style={{ color: '#2e7d32' }}>
                                Total: ${parseFloat(selectedOrder.total).toFixed(2)}
                            </h4>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            <Modal show={showEditProductModal} onHide={() => setShowEditProductModal(false)} centered>
                <Modal.Header closeButton style={{ border: 'none' }}>
                    <Modal.Title className="fw-bold" style={{ color: '#2e7d32' }}>Editar Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleActualizarProducto}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control required value={productoAEditar.nombre} onChange={e => setProductoAEditar({...productoAEditar, nombre: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control required type="number" step="0.01" value={productoAEditar.precio} onChange={e => setProductoAEditar({...productoAEditar, precio: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control required type="number" value={productoAEditar.stock} onChange={e => setProductoAEditar({...productoAEditar, stock: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Actualizar Imagen (Opcional)</Form.Label>
                            <Form.Control type="file" onChange={e => setImagenEdicion(e.target.files[0])} />
                        </Form.Group>
                        <Button type="submit" className="w-100 fw-bold" style={{ backgroundColor: '#2e7d32', border: 'none' }}>Actualizar Producto</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)} centered>
                <Modal.Header closeButton style={{ border: 'none' }}>
                    <Modal.Title className="fw-bold" style={{ color: '#2e7d32' }}>
                        Mensaje de {selectedMessage?.nombre}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-light mx-3 mb-3" style={{ borderRadius: '15px' }}>
                    {selectedMessage && (
                        <div className="p-2">
                            <p className="mb-2"><strong>Nombre:</strong> {selectedMessage.nombre}</p>
                            <p className="mb-2"><strong>Email:</strong> {selectedMessage.email}</p>
                            <p className="mb-2"><strong>Teléfono:</strong> {selectedMessage.telefono}</p>
                            <p className="mb-2"><strong>Asunto:</strong> {selectedMessage.asunto}</p>
                            <hr/>
                            <div className="bg-white p-3" style={{ borderRadius: '10px', minHeight: '150px' }}>
                                <p className="mb-0"><strong>Mensaje:</strong></p>
                                <p className="mt-2">{selectedMessage.mensaje}</p>
                            </div>
                            <p className="mt-3 text-muted" style={{ fontSize: '12px' }}>
                                <strong>Fecha:</strong> {new Date(selectedMessage.fecha).toLocaleString()}
                            </p>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Dashboard;