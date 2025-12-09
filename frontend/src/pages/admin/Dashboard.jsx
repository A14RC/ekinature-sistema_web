import React, { useEffect, useState } from 'react';
import { Container, Table, Badge, Button, Form, Card, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import orderService from '../../services/orderService';

const Dashboard = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para Modal de Detalles
  const [showModal, setShowModal] = useState(false);
  const [detallesPedido, setDetallesPedido] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
    }
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      const data = await orderService.getAllOrders();
      setPedidos(data);
    } catch (error) {
      alert("Error cargando pedidos");
    } finally {
      setLoading(false);
    }
  };

  const handleEstadoChange = async (id, nuevoEstado) => {
    if (window.confirm(`¿Cambiar estado a "${nuevoEstado}"?`)) {
      try {
        await orderService.updateStatus(id, nuevoEstado);
        cargarPedidos();
      } catch (error) {
        alert("No se pudo actualizar");
      }
    }
  };

  const handleVerDetalles = async (pedido) => {
    setPedidoSeleccionado(pedido);
    try {
      const detalles = await orderService.getOrderDetails(pedido.id);
      setDetallesPedido(detalles);
      setShowModal(true);
    } catch (error) {
      alert("Error cargando detalles del pedido");
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getBadgeColor = (estado) => {
    switch (estado) {
      case 'pendiente': return 'warning';
      case 'enviado': return 'info';
      case 'entregado': return 'success';
      case 'cancelado': return 'danger';
      default: return 'secondary';
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

      <Row>
        <Col md={12}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0 fw-bold">📦 Gestión de Pedidos</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="align-middle mb-0">
                <thead className="bg-light text-secondary">
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
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
                      <td>
                        <Badge bg={getBadgeColor(pedido.estado)} className="text-uppercase px-3 py-2">
                          {pedido.estado}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                            <Form.Select 
                            size="sm" 
                            style={{ maxWidth: '140px' }}
                            value={pedido.estado}
                            onChange={(e) => handleEstadoChange(pedido.id, e.target.value)}
                            >
                            <option value="pendiente">Pendiente</option>
                            <option value="enviado">Enviado</option>
                            <option value="entregado">Entregado</option>
                            <option value="cancelado">Cancelado</option>
                            </Form.Select>
                            
                            <Button 
                                variant="outline-primary" 
                                size="sm" 
                                onClick={() => handleVerDetalles(pedido)}
                                title="Ver Productos"
                            >
                                👁️
                            </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pedidos.length === 0 && !loading && (
                    <tr>
                      <td colSpan="6" className="text-center py-5">No hay pedidos registrados.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* MODAL DE DETALLES (HU11) */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Pedido #{pedidoSeleccionado?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pedidoSeleccionado && (
            <div className="mb-4 p-3 bg-light rounded border">
              <h6 className="fw-bold text-primary-custom">Datos del Cliente</h6>
              <Row>
                  <Col md={6}>
                    <p className="mb-1"><strong>Nombre:</strong> {pedidoSeleccionado.cliente_nombre}</p>
                    <p className="mb-1"><strong>Cédula:</strong> {pedidoSeleccionado.cliente_cedula}</p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-1"><strong>Teléfono:</strong> {pedidoSeleccionado.telefono}</p>
                    <p className="mb-1"><strong>Dirección:</strong> {pedidoSeleccionado.direccion}</p>
                  </Col>
              </Row>
            </div>
          )}
          
          <h6 className="fw-bold">Productos Comprados</h6>
          <Table size="sm" bordered>
            <thead className="table-light">
                <tr>
                    <th>Producto</th>
                    <th className="text-center">Cant.</th>
                    <th className="text-end">Precio Unit.</th>
                    <th className="text-end">Subtotal</th>
                </tr>
            </thead>
            <tbody>
              {detallesPedido.map((d, i) => (
                <tr key={i}>
                  <td>{d.nombre}</td>
                  <td className="text-center">{d.cantidad}</td>
                  <td className="text-end">${d.precio_unitario}</td>
                  <td className="text-end fw-bold">${(d.cantidad * d.precio_unitario).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          {pedidoSeleccionado && (
              <div className="text-end mt-3">
                  <h5 className="fw-bold">Total Pagado: ${parseFloat(pedidoSeleccionado.total).toFixed(2)}</h5>
              </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default Dashboard;