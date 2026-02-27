import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Tabs, Tab, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [pedidos, setPedidos] = useState([]);
    const [mensajes, setMensajes] = useState([]);
    const [kpis, setKpis] = useState({ ventasHoy: 0, ingresosHoy: 0 });
    const [showModal, setShowModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
        // Intervalo de actualización automática cada 5 segundos
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const resOrders = await axios.get('http://localhost:3000/api/pedidos');
            const resKpis = await axios.get('http://localhost:3000/api/pedidos/kpis/hoy');
            const resMsgs = await axios.get('http://localhost:3000/api/contacto');
            
            setPedidos(resOrders.data);
            setKpis(resKpis.data);
            setMensajes(resMsgs.data);
        } catch (error) {
            console.error("Error de carga de datos en el Dashboard");
        }
    };

    const handleUpdateStatus = async (id, nuevoEstado) => {
        try {
            await axios.put(`http://localhost:3000/api/pedidos/${id}/estado`, { estado: nuevoEstado });
            fetchData();
        } catch (err) {
            alert("Error al actualizar el estado");
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
        // Actualiza el estado a enviado automáticamente
        await handleUpdateStatus(order.id, 'enviado');

        const printWindow = window.open('', '_blank');
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Pedido:${order.id}|Cliente:${order.cliente_nombre}|Telf:${order.telefono}`;

        printWindow.document.write(`
            <html>
                <body style="font-family: Arial; padding: 20px; width: 350px; border: 2px dashed #2e7d32; text-align:center; color: #333;">
                    <h2 style="color:#2e7d32; margin-bottom: 5px;">EKINATURE</h2>
                    <p style="margin: 0; font-size: 12px;">GUÍA DE ENVÍO PROFESIONAL</p>
                    <hr style="border: 0.5px solid #eee; margin: 15px 0;"/>
                    <div style="text-align:left; font-size: 14px;">
                        <p><strong>DESTINATARIO:</strong> ${order.cliente_nombre}</p>
                        <p><strong>DIRECCIÓN:</strong> ${order.direccion}</p>
                        <p><strong>TELÉFONO:</strong> ${order.telefono}</p>
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
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/login');
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleViewMessage = (message) => {
        setSelectedMessage(message);
        setShowMessageModal(true);
    };

    return (
        <Container className="my-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold" style={{ color: '#2e7d32' }}>Panel de Control EkiNature</h2>
                <Button variant="outline-danger" onClick={handleLogout} className="fw-bold">Cerrar Sesión 🚪</Button>
            </div>

            {/* KPIs Informativos */}
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
                            ${parseFloat(kpis.ingresosHoy).toFixed(2)}
                        </h2>
                    </Card>
                </Col>
            </Row>

            {/* Sistema de Pestañas */}
            <Tabs defaultActiveKey="pedidos" className="mb-4 custom-tabs">
                <Tab eventKey="pedidos" title="Pedidos Recientes">
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
                                                value={p.estado} 
                                                onChange={(e) => handleUpdateStatus(p.id, e.target.value)}
                                                style={{ borderRadius: '10px' }}
                                            >
                                                <option value="pendiente">Pendiente</option>
                                                <option value="enviado">Enviado</option>
                                                <option value="entregado">Entregado</option>
                                                <option value="cancelado">Cancelado</option>
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

                <Tab eventKey="mensajes" title={`Mensajes (${mensajes.length})`}>
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
                                    <tr key={m.id}>
                                        <td>{new Date(m.fecha).toLocaleDateString()}</td>
                                        <td>{m.nombre}</td>
                                        <td className="text-muted">{m.asunto}</td>
                                        <td className="text-center">
                                            <Button 
                                                variant="link" 
                                                title="Ver Mensaje"
                                                onClick={() => handleViewMessage(m)}
                                            >
                                                👁️
                                            </Button>
                                            <Button 
                                                variant="link" 
                                                className="text-danger" 
                                                onClick={() => handleDeleteMessage(m.id)}
                                                title="Eliminar"
                                            >
                                                🗑️
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        {mensajes.length === 0 && <p className="text-center text-muted mt-3">No hay mensajes nuevos.</p>}
                    </Card>
                </Tab>
            </Tabs>

            {/* Modal de Detalle de Pedido */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton style={{ border: 'none' }}>
                    <Modal.Title className="fw-bold" style={{ color: '#2e7d32' }}>
                        Detalles del Pedido #{selectedOrder?.id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-light mx-3 mb-3" style={{ borderRadius: '15px' }}>
                    {selectedOrder && (
                        <div className="p-2">
                            <p className="mb-2"><strong>Cédula:</strong> {selectedOrder.cliente_cedula}</p>
                            <p className="mb-2"><strong>Dirección:</strong> {selectedOrder.direccion}</p>
                            <p className="mb-2"><strong>Teléfono:</strong> {selectedOrder.telefono}</p>
                            <p className="mb-2"><strong>Método de Pago:</strong> {selectedOrder.metodo_pago}</p>
                            <hr/>
                            <h4 className="text-end fw-bold" style={{ color: '#2e7d32' }}>
                                Total: ${parseFloat(selectedOrder.total).toFixed(2)}
                            </h4>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            {/* Modal de Detalle de Mensaje */}
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