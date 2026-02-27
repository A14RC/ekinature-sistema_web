import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Container, Table, Button, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Carrito = () => {
    const { cart, removeFromCart, clearCart } = useCart();
    const [step, setStep] = useState(1);
    const [metodoPago, setMetodoPago] = useState('Transferencia Bancaria');
    // Eliminada la cédula según requerimiento
    const [datos, setDatos] = useState({ nombre: '', direccion: '', telefono: '', email: '' });
    // Nuevo estado para el número de comprobante
    const [numComprobante, setNumComprobante] = useState('');

    // CÁLCULO PROFESIONAL DEL CARRITO
    const subtotal = cart.reduce((acc, item) => {
        const precio = Number(item.precio) || 0;
        const cant = Number(item.cantidad) || 0;
        return acc + (precio * cant);
    }, 0);

    const envio = 5; // $5 USD de envío fijo
    const subtotalConEnvio = subtotal + envio;
    const iva = subtotalConEnvio * 0.15; // IVA del 15%
    const totalCompra = subtotalConEnvio + iva;

    const handleFinalizar = async (e) => {
        e.preventDefault();
        
        // Nueva estructura de objeto para la transacción atómica del Backend
        const pedido = {
            cliente: {
                nombre: datos.nombre,
                email: datos.email,
                telefono: datos.telefono,
                direccion: datos.direccion
            },
            pago: {
                total: totalCompra.toFixed(2),
                metodo_pago: metodoPago,
                num_comprobante: numComprobante || 'Pago en efectivo/pendiente'
            },
            productos: cart.map(item => ({
                id: item.id,
                cantidad: item.cantidad
            }))
        };

        try {
            await axios.post('http://localhost:3000/api/pedidos', pedido);
            alert('¡Pedido procesado con éxito!');
            clearCart();
            setStep(3);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.error || 'Error en el servidor. Revise la consola.');
        }
    };

    if (step !== 3 && cart.length === 0) {
        return <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', paddingTop: '60px' }}><Container className="text-center"><div style={{ fontSize: '4rem', marginBottom: '20px' }}>🛒</div><h2 style={{ color: '#2e7d32', marginBottom: '30px' }}>El carrito está vacío</h2><Button as={Link} to="/productos" className="fw-bold px-5 py-3" style={{ backgroundColor: '#2e7d32', border: 'none', borderRadius: '12px' }}>Ir a Tienda</Button></Container></div>;
    }

    return (
        <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', paddingTop: '40px', paddingBottom: '40px' }}>
            <Container className="my-5">
            {step === 1 && (
                <Card className="p-5 shadow-lg border-0" style={{ borderRadius: '25px', backgroundColor: 'white' }}>
                    <h2 className="mb-4 fw-bold" style={{ color: '#1b5e20' }}>🛒 Revisión de Pedido</h2>
                    <Table responsive hover style={{ marginBottom: '30px' }}>
                        <thead style={{ backgroundColor: '#f1f8e9' }}>
                            <tr>
                                <th style={{ color: '#2e7d32', fontWeight: 'bold' }}>Producto</th>
                                <th style={{ color: '#2e7d32', fontWeight: 'bold' }}>Cantidad</th>
                                <th style={{ color: '#2e7d32', fontWeight: 'bold' }}>Subtotal</th>
                                <th style={{ color: '#2e7d32', fontWeight: 'bold' }} className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map(item => (
                                <tr key={item.id}>
                                    <td className="fw-semibold">{item.nombre}</td>
                                    <td>{item.cantidad}</td>
                                    <td className="fw-bold text-success">${(Number(item.precio) * Number(item.cantidad)).toFixed(2)}</td>
                                    <td className="text-center"><Button variant="outline-danger" size="sm" onClick={() => removeFromCart(item.id)}>✕ Quitar</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div style={{ backgroundColor: '#f9f9f9', padding: '25px', borderRadius: '15px', marginBottom: '20px' }}>
                        <div className="mb-3 pb-3" style={{ borderBottom: '1px solid #ddd' }}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span style={{ color: '#555' }}>Subtotal de Productos:</span>
                                <span className="fw-bold" style={{ color: '#333' }}>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span style={{ color: '#555' }}>Envío:</span>
                                <span className="fw-bold" style={{ color: '#333' }}>${envio.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <span style={{ color: '#555' }}>IVA (15%):</span>
                                <span className="fw-bold" style={{ color: '#2e7d32' }}>${iva.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <h4 style={{ color: '#1b5e20', marginBottom: 0 }}>Total a Pagar:</h4>
                            <h3 style={{ color: '#2e7d32', marginBottom: 0 }}>${totalCompra.toFixed(2)}</h3>
                        </div>
                    </div>
                    <Button className="w-100 fw-bold py-3" size="lg" onClick={() => setStep(2)} style={{ backgroundColor: '#2e7d32', border: 'none', borderRadius: '12px' }}>Proceder al Pago</Button>
                </Card>
            )}

            {step === 2 && (
                <Form onSubmit={handleFinalizar}>
                    <Row>
                        <Col md={7}>
                            <Card className="p-5 shadow-lg border-0 mb-4" style={{ borderRadius: '25px', backgroundColor: 'white' }}>
                                <h4 className="fw-bold mb-4" style={{ color: '#1b5e20' }}>📍 Detalles de Despacho</h4>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Nombre Completo</Form.Label>
                                    <Form.Control required onChange={e => setDatos({...datos, nombre: e.target.value})} style={{ borderRadius: '10px', padding: '10px' }} placeholder="Juan Pérez" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Email</Form.Label>
                                    <Form.Control type="email" required onChange={e => setDatos({...datos, email: e.target.value})} style={{ borderRadius: '10px', padding: '10px' }} placeholder="tu@email.com" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Dirección de Envío</Form.Label>
                                    <Form.Control required onChange={e => setDatos({...datos, direccion: e.target.value})} style={{ borderRadius: '10px', padding: '10px' }} placeholder="Calle Principal 123, Quito" />
                                </Form.Group>
                                <Form.Group className="mb-0">
                                    <Form.Label className="fw-semibold">Celular</Form.Label>
                                    <Form.Control required onChange={e => setDatos({...datos, telefono: e.target.value})} style={{ borderRadius: '10px', padding: '10px' }} placeholder="+593 99 000 0000" />
                                </Form.Group>
                            </Card>
                        </Col>
                        <Col md={5}>
                            <Card className="p-5 shadow-lg border-0" style={{ borderRadius: '25px', backgroundColor: '#f1f8e9' }}>
                                <h4 className="fw-bold mb-4" style={{ color: '#1b5e20' }}>💳 Método de Pago</h4>
                                <Form.Select className="mb-4" onChange={e => setMetodoPago(e.target.value)} style={{ borderRadius: '10px', padding: '10px' }}>
                                    <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                                    <option value="DeUna!">DeUna! (QR)</option>
                                </Form.Select>
                                
                                {metodoPago === 'DeUna!' && (
                                    <div className="text-center mb-4">
                                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=EkiNaturePay" width="150" alt="QR" style={{ borderRadius: '10px' }} />
                                        <p className="small text-muted mt-3" style={{ fontWeight: '500' }}>Escanea para pagar con DeUna!</p>
                                    </div>
                                )}
                                {metodoPago === 'Transferencia Bancaria' && (
                                    <Alert variant="success" className="mb-4" style={{ borderRadius: '10px' }}>
                                        <b>Banco Pichincha</b><br/>
                                        <span style={{ fontSize: '0.9rem' }}>Titular: Andrés Romero</span><br/>
                                        <span style={{ fontSize: '0.9rem' }}>Cuenta: 220XXXXXXX</span>
                                    </Alert>
                                )}

                                {/* NUEVO CAMPO: NÚMERO DE COMPROBANTE */}
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">Número de Comprobante / Referencia</Form.Label>
                                    <Form.Control 
                                        required 
                                        onChange={e => setNumComprobante(e.target.value)} 
                                        style={{ borderRadius: '10px', padding: '10px' }} 
                                        placeholder="Ej. #123456789" 
                                    />
                                    <Form.Text className="text-muted">
                                        Ingresa el número de referencia de tu transferencia o pago DeUna!.
                                    </Form.Text>
                                </Form.Group>

                                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                                    <div className="mb-3 pb-3" style={{ borderBottom: '1px solid #eee' }}>
                                        <div className="d-flex justify-content-between align-items-center mb-2" style={{ fontSize: '0.95rem' }}>
                                            <span style={{ color: '#666' }}>Subtotal:</span>
                                            <span className="fw-bold" style={{ color: '#333' }}>${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center mb-2" style={{ fontSize: '0.95rem' }}>
                                            <span style={{ color: '#666' }}>Envío:</span>
                                            <span className="fw-bold" style={{ color: '#333' }}>${envio.toFixed(2)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '0.95rem' }}>
                                            <span style={{ color: '#666' }}>IVA (15%):</span>
                                            <span className="fw-bold" style={{ color: '#2e7d32' }}>${iva.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p style={{ color: '#666', marginBottom: '5px', fontSize: '0.9rem' }}>Total a Pagar</p>
                                        <h3 style={{ color: '#2e7d32', marginBottom: 0 }}>${totalCompra.toFixed(2)}</h3>
                                    </div>
                                </div>
                                <Button type="submit" className="w-100 fw-bold py-3" size="lg" style={{ backgroundColor: '#2e7d32', border: 'none', borderRadius: '12px' }}>✓ Finalizar Compra</Button>
                            </Card>
                        </Col>
                    </Row>
                </Form>
            )}

            {step === 3 && (
                <Card className="p-5 shadow-lg border-0 text-center" style={{ borderRadius: '25px', backgroundColor: 'white' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '20px' }}>✅</div>
                    <h1 className="fw-bold mb-3" style={{ color: '#1b5e20' }}>¡Pedido Confirmado!</h1>
                    <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '30px' }}>
                        Tu pedido ha sido procesado correctamente. Revisa tu correo electrónico para los detalles del envío.
                    </p>
                    <Button as={Link} to="/" className="fw-bold px-5 py-3" size="lg" style={{ backgroundColor: '#2e7d32', border: 'none', borderRadius: '12px' }}>Volver al Inicio</Button>
                </Card>
            )}
            </Container>
        </div>
    );
};

export default Carrito;