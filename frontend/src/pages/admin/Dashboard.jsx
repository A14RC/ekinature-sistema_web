import React, { useEffect, useState } from 'react';
import { Container, Table, Badge, Button, Form, Card, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import orderService from '../../services/orderService';

const Dashboard = () => {
  const [pedidos, setPedidos] = useState([]);
  const [entregasProximas, setEntregasProximas] = useState([]); // Cambiamos nombre a "Proximas"
  const [loading, setLoading] = useState(true);
  
  // Modales
  const [showModal, setShowModal] = useState(false);
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  // Modal Agendar
  const [showModalAgenda, setShowModalAgenda] = useState(false);
  const [fechaAgenda, setFechaAgenda] = useState('');
  
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!authService.isAuthenticated()) navigate('/login');
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const dataPedidos = await orderService.getAllOrders();
      setPedidos(dataPedidos);
      
      const dataEntregas = await orderService.getTodayDeliveries();
      setEntregasProximas(dataEntregas);
    } catch (error) {
      console.error("Error cargando datos");
    } finally {
      setLoading(false);
    }
  };

  // Funciones Auxiliares
  const handleEstadoChange = async (id, nuevoEstado) => {
    // Confirmación suave
    if (window.confirm(`¿Cambiar estado a "${nuevoEstado}"?`)) {
        try { await orderService.updateStatus(id, nuevoEstado); cargarDatos(); } catch (e) { alert("Error"); }
    }
  };
  
  const handleVerDetalles = async (pedido) => {
    setPedidoSeleccionado(pedido);
    try {
        const detalles = await orderService.getOrderDetails(pedido.id);
        setDetallesPedido(detalles);
        setShowModal(true);
    } catch (e) { alert("Error"); }
  };
  
  const handleLogout = () => { authService.logout(); navigate('/login'); };
  
  const getBadgeColor = (estado) => {
    switch (estado) {
        case 'pendiente': return 'warning';
        case 'enviado': return 'info';
        case 'entregado': return 'success';
        case 'cancelado': return 'danger';
        default: return 'secondary';
      }
   };

  // --- LÓGICA DE FECHAS RÁPIDAS ---
  const setFechaRapida = (dias) => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    // Formato YYYY-MM-DD para el input
    const fechaStr = fecha.toISOString().split('T')[0];
    setFechaAgenda(fechaStr);
  };

  const abrirModalAgenda = (pedido) => {
    setPedidoSeleccionado(pedido);
    setFechaAgenda('');
    setShowModalAgenda(true);
  };

  const handleGuardarAgenda = async () => {
    if (!fechaAgenda) return alert("Selecciona una fecha");
    try {
      await orderService.scheduleDelivery(pedidoSeleccionado.id, fechaAgenda);
      // alert("✅ Entrega programada"); // Opcional: quitar alerta para ser más rápido
      setShowModalAgenda(false);
      cargarDatos();
    } catch (error) {
      alert("Error al programar entrega");
    }
  };

  return (
    <Container fluid className="py-4 bg-light" style={{ minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
           <h2 className="fw-bold text-primary-custom">Panel de Administración</h2>
           <p className="text-muted">Hola, {user?.nombre || 'Admin'}</p>
        </div>
        <Button variant="outline-danger" onClick={handleLogout}>Cerrar Sesión 🚪</Button>
      </div>

      {/* --- SECCIÓN: RUTAS DE HOY Y MAÑANA --- */}
      <Row className="mb-4">
        <Col md={12}>
            <Card className="shadow-sm border-0 border-start border-success border-4">
                <Card.Body>
                    <h5 className="fw-bold text-success">🚚 Entregas: Hoy y Mañana</h5>
                    {entregasProximas.length === 0 ? (
                        <p className="text-muted mb-0">No hay rutas planificadas para las próximas 48 horas.</p>
                    ) : (
                        <Table size="sm" responsive className="mb-0 mt-2">
                            <thead><tr><th>Fecha</th><th>ID</th><th>Cliente</th><th>Dirección</th><th>Teléfono</th><th>Estado</th></tr></thead>
                            <tbody>
                                {entregasProximas.map(e => (
                                    <tr key={e.id}>
                                        {/* Mostramos la fecha formateada */}
                                        <td className="fw-bold text-primary">
                                            {new Date(e.fecha_programada).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                        </td>
                                        <td>#{e.pedido_id}</td>
                                        <td>{e.cliente_nombre}</td>
                                        <td>{e.direccion}</td>
                                        <td>{e.telefono}</td>
                                        <td><Badge bg="info">{e.estado}</Badge></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </Col>
      </Row>

      {/* --- LISTA DE TODOS LOS PEDIDOS --- */}
      <Row>
        <Col md={12}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0 fw-bold">📦 Todos los Pedidos</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="align-middle mb-0">
                <thead className="bg-light text-secondary">
                  <tr>
                    <th>ID</th>
                    <th>Fecha Compra</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido) => (
                    <tr key={pedido.id}>
                      <td className="fw-bold">#{pedido.id}</td>
                      <td>{new Date(pedido.created_at).toLocaleDateString()}</td>
                      <td>{pedido.cliente_nombre}</td>
                      <td className="fw-bold">${parseFloat(pedido.total).toFixed(2)}</td>
                      <td><Badge bg={getBadgeColor(pedido.estado)} className="text-uppercase">{pedido.estado}</Badge></td>
                      <td>
                        <div className="d-flex gap-2">
                            <Button variant="outline-primary" size="sm" onClick={() => handleVerDetalles(pedido)} title="Ver Productos">👁️</Button>
                            
                            {/* Botón Agendar solo si es pendiente */}
                            {pedido.estado === 'pendiente' && (
                                <Button variant="success" size="sm" onClick={() => abrirModalAgenda(pedido)} title="Agendar Entrega">📅</Button>
                            )}

                            <Form.Select size="sm" style={{ maxWidth: '130px' }} value={pedido.estado} onChange={(e) => handleEstadoChange(pedido.id, e.target.value)}>
                                <option value="pendiente">Pendiente</option>
                                <option value="enviado">Enviado</option>
                                <option value="entregado">Entregado</option>
                                <option value="cancelado">Cancelado</option>
                            </Form.Select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* MODAL DETALLES */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
         <Modal.Header closeButton><Modal.Title>Detalles #{pedidoSeleccionado?.id}</Modal.Title></Modal.Header>
         <Modal.Body>
            <Table size="sm"><tbody>{detallesPedido.map((d,i)=>(<tr key={i}><td>{d.nombre}</td><td>{d.cantidad}</td></tr>))}</tbody></Table>
         </Modal.Body>
      </Modal>

      {/* MODAL AGENDAR MEJORADO */}
      <Modal show={showModalAgenda} onHide={() => setShowModalAgenda(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>📅 Planificar Entrega</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Asignar fecha de entrega para el pedido <strong>#{pedidoSeleccionado?.id}</strong>.</p>
          
          {/* BOTONES RÁPIDOS */}
          <div className="d-flex gap-2 mb-3">
             <Button variant="outline-success" size="sm" onClick={() => setFechaRapida(0)}>Hoy</Button>
             <Button variant="outline-primary" size="sm" onClick={() => setFechaRapida(1)}>Mañana</Button>
          </div>

          <Form.Group>
            <Form.Label>Fecha Seleccionada:</Form.Label>
            <Form.Control 
                type="date" 
                value={fechaAgenda} 
                onChange={(e) => setFechaAgenda(e.target.value)} 
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalAgenda(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleGuardarAgenda}>Confirmar</Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default Dashboard;