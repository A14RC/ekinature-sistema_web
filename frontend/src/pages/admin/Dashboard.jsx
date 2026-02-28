import { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Tabs, Tab, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../api';

const Dashboard = () => {
    const [pedidos, setPedidos] = useState([]);
    const [mensajes, setMensajes] = useState([]);
    const [operadores, setOperadores] = useState([]);
    const [kpis, setKpis] = useState({ ventasHoy: 0, ingresosHoy: 0 });
    const [showModal, setShowModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showEditProductModal, setShowEditProductModal] = useState(false);
    const [showAddAdminModal, setShowAddAdminModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [nuevoAdmin, setNuevoAdmin] = useState({ usuario: '', password: '', rol: 'OPERADOR' });
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
        audio.volume = 0.8;
        audio.play().catch(e => console.log("Esperando interacción para habilitar audio..."));
    };

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const resProd = await axios.get(`${API_BASE_URL}/productos`);
            setProductos(resProd.data);

            const resOrders = await axios.get(`${API_BASE_URL}/pedidos`);
            if (prevPedidosCount.current !== 0 && resOrders.data.length > prevPedidosCount.current) {
                playNotificationSound();
            }
            prevPedidosCount.current = resOrders.data.length;
            setPedidos(resOrders.data);

            const resMsgs = await axios.get(`${API_BASE_URL}/contacto`);
            if (prevMensajesCount.current !== 0 && resMsgs.data.length > prevMensajesCount.current) {
                playNotificationSound();
            }
            prevMensajesCount.current = resMsgs.data.length;

            const mensajesFromServer = resMsgs.data.map(m => ({
                ...m,
                leido: !!m.leido
            }));
            setMensajes(mensajesFromServer);

            const resOps = await axios.get(`${API_BASE_URL}/auth/operadores`, config);
            setOperadores(resOps.data);

            const resKpis = await axios.get(`${API_BASE_URL}/pedidos/kpis/hoy`);
            setKpis(resKpis.data);
        } catch (error) {}
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        
        // Desbloqueo de audio en el primer click
        const unlockAudio = () => {
            playNotificationSound();
            window.removeEventListener('click', unlockAudio);
        };
        window.addEventListener('click', unlockAudio);

        return () => {
            clearInterval(interval);
            window.removeEventListener('click', unlockAudio);
        };
    }, []);

    const handleCrearAdmin = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/auth/register`, nuevoAdmin, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Responsable registrado con éxito");
            setShowAddAdminModal(false);
            setNuevoAdmin({ usuario: '', password: '', rol: 'OPERADOR' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.mensaje || err.message || "Error al registrar responsable");
        }
    };

    const handleEliminarOperador = async (id) => {
        if (window.confirm("¿Eliminar este acceso de responsable?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_BASE_URL}/auth/operadores/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchData();
            } catch (err) { alert("Error al eliminar"); }
        }
    };

    const handleCrearProducto = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();
        Object.entries(nuevoProducto).forEach(([key, val]) => formData.append(key, val));
        if (imagen) formData.append('imagen', imagen);
        try {
            await axios.post(`${API_BASE_URL}/productos`, formData, { 
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                } 
            });
            setNuevoProducto({ nombre: '', descripcion: '', precio: '', stock: '' });
            setImagen(null);
            fetchData();
            alert("Producto creado exitosamente");
        } catch (err) { alert("Error al crear: " + (err.response?.data?.mensaje || "Problema de permisos")); }
    };

    const handleActualizarProducto = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();
        Object.entries(productoAEditar).forEach(([key, val]) => formData.append(key, val));
        if (imagenEdicion) formData.append('imagen', imagenEdicion);
        try {
            await axios.put(`${API_BASE_URL}/productos/${productoAEditar.id}`, formData, { 
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                } 
            });
            setShowEditProductModal(false);
            fetchData();
        } catch (err) { alert("Error al actualizar"); }
    };

    const handleUpdateStatus = async (id, nuevoEstado) => {
        try {
            const token = localStorage.getItem('token');
            const est = nuevoEstado.toUpperCase();
            await axios.put(`${API_BASE_URL}/pedidos/${id}/estado`, { estado: est }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPedidos(pedidos.map(p => p.id === id ? { ...p, estado: est } : p));
        } catch (err) {}
    };

    const generateLabel = async (order) => {
        await handleUpdateStatus(order.id, 'ENVIADO');
        const tel = order.cliente_telefono || order.telefono || "N/A";
        const printWindow = window.open('', '_blank');
        const qrContent = `ID:${order.id}|DEST:${order.cliente_nombre}|DIR:${order.direccion}|TEL:${tel}`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrContent)}`;

        printWindow.document.write(`
            <html>
                <body style="font-family:Arial,sans-serif; margin:0; padding:10px; width:10cm; height:15cm; border:1px solid #000; box-sizing:border-box; display:flex; flex-direction:column; justify-content:space-between; text-align:center;">
                    <div style="border-bottom:2px solid #2e7d32; padding-bottom:5px;">
                        <h2 style="margin:0; color:#2e7d32; font-size:24px;">EKINATURE</h2>
                        <p style="margin:0; font-size:10px;">GUÍA DE ENVÍO PROFESIONAL</p>
                    </div>
                    <div style="text-align:left; font-size:12px; margin-top:10px;">
                        <p style="margin:2px 0;"><strong>REMITENTE:</strong> EkiNature Ecuador - Quito</p>
                        <p style="margin:2px 0;"><strong>PRODUCTO:</strong> Insecticida Gel Profesional</p>
                    </div>
                    <hr style="border:0; border-top:1px dashed #ccc;"/>
                    <div style="text-align:left; font-size:14px; flex-grow:1; display:flex; flex-direction:column; justify-content:center;">
                        <p style="margin:5px 0; font-size:16px;"><strong>DESTINATARIO:</strong><br/> ${order.cliente_nombre}</p>
                        <p style="margin:5px 0;"><strong>DIRECCIÓN:</strong><br/> ${order.direccion}</p>
                        <p style="margin:5px 0;"><strong>TELÉFONO:</strong> ${tel}</p>
                        <p style="margin:5px 0;"><strong>PEDIDO:</strong> #${order.id}</p>
                    </div>
                    <div style="margin-bottom:10px;">
                        <img src="${qrUrl}" style="width:120px; height:120px;"/>
                        <p style="margin:5px 0 0 0; font-size:9px; color:#666;">ESCANEAR PARA VALIDAR LOGÍSTICA</p>
                    </div>
                    <div style="border-top:1px solid #000; padding-top:5px; font-size:10px;">
                        GRACIAS POR SU COMPRA - EKINATURE.COM
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); }, 500);
    };

    const handleViewMessage = async (m) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/contacto/${m.id}/leido`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.error('Error marcando mensaje como leído', err);
        }
        setMensajes(prev => prev.map(msg => msg.id === m.id ? { ...msg, leido: true } : msg));
        setSelectedMessage(m);
        setShowMessageModal(true);
    };

    const countP = pedidos.filter(p => p.estado?.toUpperCase() === 'PENDIENTE').length;
    const countM = mensajes.filter(m => !m.leido).length;

    return (
        <Container className="my-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold" style={{ color: '#2e7d32' }}>Panel de Control EkiNature</h2>
                <div>
                    <Button variant="success" className="me-2 fw-bold" onClick={() => setShowAddAdminModal(true)}>+ Responsable</Button>
                    <Button variant="outline-danger" onClick={() => { localStorage.clear(); navigate('/login'); }} className="fw-bold">Cerrar Sesión 🚪</Button>
                </div>
            </div>

            <Row className="mb-4">
                <Col md={6} className="mb-3"><Card className="text-center border-0 shadow-sm bg-success text-white p-3" style={{ borderRadius: '20px' }}><h5>Ventas del Día</h5><h2 className="fw-bold display-5">{kpis.ventasHoy}</h2></Card></Col>
                <Col md={6}><Card className="text-center border-0 shadow-sm p-3" style={{ borderRadius: '20px', backgroundColor: '#e8f5e9' }}><h5 style={{ color: '#2e7d32' }}>Ingresos Hoy</h5><h2 className="fw-bold display-5" style={{ color: '#1b5e20' }}>${parseFloat(kpis.ingresosHoy || 0).toFixed(2)}</h2></Card></Col>
            </Row>

            <Tabs defaultActiveKey="pedidos" className="mb-4 custom-tabs">
                <Tab eventKey="pedidos" title={<span>🛒 Pedidos {countP > 0 && <Badge bg="danger">{countP}</Badge>}</span>}>
                    <Card className="border-0 shadow-sm p-4" style={{ borderRadius: '25px' }}>
                        <Table responsive hover align="middle">
                            <thead><tr><th>ID</th><th>Cliente</th><th>Total</th><th>Estado</th><th className="text-center">Acciones</th></tr></thead>
                            <tbody>{pedidos.map(p => (<tr key={p.id}><td>#{p.id}</td><td>{p.cliente_nombre}</td><td className="fw-bold text-success">${parseFloat(p.total).toFixed(2)}</td><td><Form.Select size="sm" value={p.estado?.toUpperCase() || 'PENDIENTE'} onChange={(e) => handleUpdateStatus(p.id, e.target.value)} style={{ borderRadius: '10px' }}><option value="PENDIENTE">Pendiente</option><option value="ENVIADO">Enviado</option><option value="CANCELADO">Cancelado</option></Form.Select></td><td className="text-center"><Button variant="link" onClick={() => { setSelectedOrder(p); setShowModal(true); }}>👁️</Button><Button variant="link" onClick={() => generateLabel(p)}>🏷️</Button><Button variant="link" className="text-danger" onClick={async () => { if(window.confirm("¿Eliminar?")) { const token = localStorage.getItem('token'); await axios.delete(`${API_BASE_URL}/pedidos/${p.id}`, { headers: { Authorization: `Bearer ${token}` } }); fetchData(); } }}>🗑️</Button></td></tr>))}</tbody>
                        </Table>
                    </Card>
                </Tab>

                <Tab eventKey="inventario" title="📦 Inventario">
                    <Card className="border-0 shadow-sm p-4" style={{ borderRadius: '25px' }}>
                        <Row>
                            <Col md={4}><div className="p-3 bg-light" style={{ borderRadius: '15px' }}><h5 className="fw-bold mb-3">Nuevo Producto</h5><Form onSubmit={handleCrearProducto}><Form.Group className="mb-2"><Form.Label>Nombre</Form.Label><Form.Control required onChange={e => setNuevoProducto({...nuevoProducto, nombre: e.target.value})} /></Form.Group><Form.Group className="mb-2"><Form.Label>Precio</Form.Label><Form.Control required type="number" step="0.01" onChange={e => setNuevoProducto({...nuevoProducto, precio: e.target.value})} /></Form.Group><Form.Group className="mb-2"><Form.Label>Stock</Form.Label><Form.Control required type="number" onChange={e => setNuevoProducto({...nuevoProducto, stock: e.target.value})} /></Form.Group><Form.Group className="mb-3"><Form.Label>Imagen</Form.Label><Form.Control type="file" onChange={e => setImagen(e.target.files[0])} /></Form.Group><Button type="submit" className="w-100" style={{ backgroundColor: '#2e7d32', border: 'none' }}>Guardar</Button></Form></div></Col>
                            <Col md={8}><Table responsive hover align="middle"><thead><tr><th>Imagen</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Acción</th></tr></thead><tbody>{productos.map(p => (<tr key={p.id}><td>{p.imagen_url && <img src={`https://ekinature-backend.onrender.com${p.imagen_url}`} width="40" height="40" style={{ objectFit: 'cover', borderRadius: '5px' }} alt=""/>}</td><td>{p.nombre}</td><td className="fw-bold">${p.precio}</td><td>{p.stock}</td><td><Button variant="outline-primary" size="sm" className="me-2" onClick={() => { setProductoAEditar({...p, descripcion: p.descripcion || ''}); setShowEditProductModal(true); }}>✏️</Button><Button variant="outline-danger" size="sm" onClick={async () => { if(window.confirm("¿Eliminar?")) { const token = localStorage.getItem('token'); await axios.delete(`${API_BASE_URL}/productos/${p.id}`, { headers: { Authorization: `Bearer ${token}` } }); fetchData(); } }}>🗑️</Button></td></tr>))}</tbody></Table></Col>
                        </Row>
                    </Card>
                </Tab>

                <Tab eventKey="mensajes" title={<span>✉️ Mensajes {countM > 0 && <Badge bg="primary">{countM}</Badge>}</span>}>
                    <Card className="border-0 shadow-sm p-4" style={{ borderRadius: '25px' }}>
                        <Table responsive hover align="middle">
                            <thead><tr><th>Fecha</th><th>Nombre</th><th>Asunto</th><th className="text-center">Acción</th></tr></thead>
                            <tbody>{mensajes.map(m => (<tr key={m.id} style={!m.leido ? { fontWeight: 'bold', backgroundColor: '#f8f9fa' } : {}}><td>{new Date(m.fecha).toLocaleDateString()}</td><td>{m.nombre}</td><td className="text-muted">{m.asunto}</td><td className="text-center"><Button variant="link" onClick={() => handleViewMessage(m)}>👁️</Button><Button variant="link" className="text-danger" onClick={async () => { if(window.confirm("¿Eliminar?")) { const token = localStorage.getItem('token'); await axios.delete(`${API_BASE_URL}/contacto/${m.id}`, { headers: { Authorization: `Bearer ${token}` } }); fetchData(); } }}>🗑️</Button></td></tr>))}</tbody>
                        </Table>
                    </Card>
                </Tab>

                <Tab eventKey="staff" title="👥 Personal">
                    <Card className="border-0 shadow-sm p-4" style={{ borderRadius: '25px' }}>
                        <Table responsive hover align="middle">
                            <thead><tr><th>Usuario</th><th>Rol</th><th>Fecha Registro</th><th className="text-center">Acciones</th></tr></thead>
                            <tbody>{operadores.map(op => (<tr key={op.id}><td>{op.usuario}</td><td><Badge bg={op.rol === 'ADMIN' ? 'dark' : 'info'}>{op.rol}</Badge></td><td>{new Date(op.created_at).toLocaleDateString()}</td><td className="text-center"><Button variant="link" className="text-danger" onClick={() => handleEliminarOperador(op.id)}>🗑️</Button></td></tr>))}</tbody>
                        </Table>
                    </Card>
                </Tab>
            </Tabs>

            <Modal show={showAddAdminModal} onHide={() => setShowAddAdminModal(false)} centered>
                <Modal.Header closeButton><Modal.Title className="fw-bold" style={{ color: '#2e7d32' }}>Registrar Nuevo Responsable</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCrearAdmin}>
                        <Form.Group className="mb-3"><Form.Label>Usuario</Form.Label><Form.Control required onChange={e => setNuevoAdmin({...nuevoAdmin, usuario: e.target.value})} /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Contraseña</Form.Label><Form.Control type="password" required onChange={e => setNuevoAdmin({...nuevoAdmin, password: e.target.value})} /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Rol de Acceso</Form.Label><Form.Select onChange={e => setNuevoAdmin({...nuevoAdmin, rol: e.target.value})}><option value="OPERADOR">Operador (Solo lectura/envío)</option><option value="ADMIN">Administrador (Acceso total)</option></Form.Select></Form.Group>
                        <Button type="submit" className="w-100 fw-bold" variant="success">Guardar Responsable</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton style={{ border: 'none' }}><Modal.Title className="fw-bold">Detalles del Pedido #{selectedOrder?.id}</Modal.Title></Modal.Header>
                <Modal.Body className="bg-light mx-3 mb-3" style={{ borderRadius: '15px' }}>
                    {selectedOrder && <div className="p-3"><Row><Col md={6}><p><strong>Cliente:</strong> {selectedOrder.cliente_nombre}</p><p><strong>Email:</strong> {selectedOrder.cliente_email}</p><p><strong>Teléfono:</strong> {selectedOrder.cliente_telefono || selectedOrder.telefono}</p><p><strong>Comprobante:</strong> <Badge bg="info">{selectedOrder.num_comprobante}</Badge></p></Col><Col md={6}><p><strong>Dirección:</strong> {selectedOrder.direccion}</p><p><strong>Método de Pago:</strong> {selectedOrder.metodo_pago}</p></Col></Row><hr/><h4 className="text-end fw-bold" style={{ color: '#2e7d32' }}>Total: ${parseFloat(selectedOrder.total).toFixed(2)}</h4></div>}
                </Modal.Body>
            </Modal>

            <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)} centered>
                <Modal.Header closeButton style={{ border: 'none' }}><Modal.Title className="fw-bold">Mensaje de {selectedMessage?.nombre}</Modal.Title></Modal.Header>
                <Modal.Body className="bg-light mx-3 mb-3" style={{ borderRadius: '15px' }}>
                    {selectedMessage && <div className="p-2"><p><b>Email:</b> {selectedMessage.email}</p><p><b>Asunto:</b> {selectedMessage.asunto}</p><hr/><div className="bg-white p-3" style={{borderRadius:'10px'}}><p>{selectedMessage.mensaje}</p></div></div>}
                </Modal.Body>
            </Modal>

            <Modal show={showEditProductModal} onHide={() => setShowEditProductModal(false)} centered>
                <Modal.Header closeButton style={{ border: 'none' }}><Modal.Title className="fw-bold">Editar Producto</Modal.Title></Modal.Header>
                <Modal.Body><Form onSubmit={handleActualizarProducto}><Form.Group className="mb-3"><Form.Label>Nombre</Form.Label><Form.Control required value={productoAEditar.nombre} onChange={e => setProductoAEditar({...productoAEditar, nombre: e.target.value})} /></Form.Group><Form.Group className="mb-3"><Form.Label>Precio</Form.Label><Form.Control required type="number" step="0.01" value={productoAEditar.precio} onChange={e => setProductoAEditar({...productoAEditar, precio: e.target.value})} /></Form.Group><Form.Group className="mb-3"><Form.Label>Stock</Form.Label><Form.Control required type="number" value={productoAEditar.stock} onChange={e => setProductoAEditar({...productoAEditar, stock: e.target.value})} /></Form.Group><Form.Group className="mb-3"><Form.Label>Imagen</Form.Label><Form.Control type="file" onChange={e => setImagenEdicion(e.target.files[0])} /></Form.Group><Button type="submit" className="w-100 fw-bold" variant="success">Actualizar</Button></Form></Modal.Body>
            </Modal>
        </Container>
    );
};

export default Dashboard;