import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Container, Table, Button, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../api';

const Carrito = () => {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
    const [step, setStep] = useState(1);
    const [metodoPago, setMetodoPago] = useState('Transferencia Bancaria');
    const [datos, setDatos] = useState({ nombre: '', direccion: '', telefono: '', email: '' });
    const [numComprobante, setNumComprobante] = useState('');

    const subtotal = cart.reduce((acc, item) => {
        const precio = Number(item.precio) || 0;
        const cant = Number(item.cantidad) || 0;
        return acc + (precio * cant);
    }, 0);

    const envio = 5;
    const subtotalConEnvio = subtotal + envio;
    const iva = subtotalConEnvio * 0.15;
    const totalCompra = subtotalConEnvio + iva;

    const handleNumComprobanteChange = (e) => {
        const val = e.target.value;
        // Validación: Solo permite números
        if (/^\d*$/.test(val)) {
            setNumComprobante(val);
        }
    };

    const handleFinalizar = async (e) => {
        e.preventDefault();
        
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
            await axios.post(`${API_BASE_URL}/pedidos`, pedido);
            clearCart();
            setStep(3);
        } catch (error) {
            alert(error.response?.data?.error || 'Error en el servidor al procesar el pedido.');
        }
    };

    if (step !== 3 && cart.length === 0) {
        return (
            <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', paddingTop: '60px' }}>
                <Container className="text-center">
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🛒</div>
                    <h2 style={{ color: '#2e7d32', marginBottom: '30px' }}>El carrito está vacío</h2>
                    <Link to="/productos">
                        <Button className="fw-bold px-5 py-3" style={{ backgroundColor: '#2e7d32', border: 'none', borderRadius: '12px' }}>
                            Ir a Tienda
                        </Button>
                    </Link>
                </Container>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh', paddingTop: '40px', paddingBottom: '40px' }}>
            <Container className="my-5">
            {step === 1 && (
                <Card className="p-5 shadow-lg border-0" style={{ borderRadius: '25px', backgroundColor: 'white' }}>
                    <h2 className="mb-4 fw-bold" style={{ color: '#1b5e20' }}>🛒 Revisión de Pedido</h2>
                    <Table responsive hover align="middle" style={{ marginBottom: '30px' }}>
                        <thead style={{ backgroundColor: '#f1f8e9' }}>
                            <tr>
                                <th style={{ color: '#2e7d32', fontWeight: 'bold' }}>Producto</th>
                                <th style={{ color: '#2e7d32', fontWeight: 'bold' }} className="text-center">Cantidad</th>
                                <th style={{ color: '#2e7d32', fontWeight: 'bold' }}>Subtotal</th>
                                <th style={{ color: '#2e7d32', fontWeight: 'bold' }} className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map(item => (
                                <tr key={item.id}>
                                    <td className="fw-semibold">{item.nombre}</td>
                                    <td>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <Button variant="outline-secondary" size="sm" onClick={() => updateQuantity(item.id, -1, item.stock)}>-</Button>
                                            <span className="mx-3 fw-bold">{item.cantidad}</span>
                                            <Button variant="outline-secondary" size="sm" onClick={() => updateQuantity(item.id, 1, item.stock)}>+</Button>
                                        </div>
                                    </td>
                                    <td className="fw-bold text-success">${(Number(item.precio) * Number(item.cantidad)).toFixed(2)}</td>
                                    <td className="text-center">
                                        <Button variant="outline-danger" size="sm" onClick={() => removeFromCart(item.id)}>✕ Quitar</Button>
                                    </td>
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
                                <h4 className="fw-bold mb-3" style={{ color: '#1b5e20' }}>📍 Detalles de Envío</h4>
                                <Alert variant="info" style={{ borderRadius: '10px' }}>
                                    <strong> ⚠️Importante⚠️:</strong> Por favor, ingresa tus datos reales y precisos. Esta información será utilizada exclusivamente por nuestro equipo de logística para coordinar el envío y asegurar la entrega correcta de tu pedido.
                                </Alert>
                                <Form.Group className="mb-3 mt-4">
                                    <Form.Label className="fw-semibold">Nombre Completo</Form.Label>
                                    <Form.Control required onChange={e => setDatos({...datos, nombre: e.target.value})} style={{ borderRadius: '10px', padding: '10px' }} placeholder="Juan Pérez" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Email</Form.Label>
                                    <Form.Control type="email" required onChange={e => setDatos({...datos, email: e.target.value})} style={{ borderRadius: '10px', padding: '10px' }} placeholder="tu@email.com" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Dirección de Envío Completa</Form.Label>
                                    <Form.Control required onChange={e => setDatos({...datos, direccion: e.target.value})} style={{ borderRadius: '10px', padding: '10px' }} placeholder="Sector, Calle Principal y Secundaria, Nro. Casa" />
                                </Form.Group>
                                <Form.Group className="mb-0">
                                    <Form.Label className="fw-semibold">Teléfono Celular</Form.Label>
                                    <Form.Control required onChange={e => setDatos({...datos, telefono: e.target.value})} style={{ borderRadius: '10px', padding: '10px' }} placeholder="0990000000" />
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
                                        <span style={{ fontSize: '0.9rem' }}>Titular: EkiNature</span><br/>
                                        <span style={{ fontSize: '0.9rem' }}>Número de Cuenta: 2202589745</span><br/>
                                        <span style={{ fontSize: '0.9rem' }}>Tipo: Cuenta Corriente</span><br/>
                                        <span style={{ fontSize: '0.9rem' }}>RUC: 1792002589001</span>
                                    </Alert>
                                )}

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">Nro. Comprobante / Referencia</Form.Label>
                                    <Form.Control 
                                        required 
                                        value={numComprobante}
                                        onChange={handleNumComprobanteChange} 
                                        style={{ borderRadius: '10px', padding: '10px' }} 
                                        placeholder="Solo números (Ej: 34722007)" 
                                    />
                                    <Form.Text className="d-block mt-2" style={{ fontWeight: '700', fontSize: '0.9rem' }}>
                                        ⚠️ IMPORTANTE⚠️: Coloca aquí el número de comprobante que aparece en tu recibo de transferencia o DeUna, esto ayudará a verificar tu pago.
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
                        Tu pedido ha sido registrado correctamente. Recibirás una notificación en breve.
                    </p>
                    <Link to="/">
                        <Button className="fw-bold px-5 py-3" size="lg" style={{ backgroundColor: '#2e7d32', border: 'none', borderRadius: '12px' }}>Volver al Inicio</Button>
                    </Link>
                </Card>
            )}
            </Container>
        </div>
    );
};

export default Carrito;