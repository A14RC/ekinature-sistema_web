import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navbar';
import Home from './pages/Home';
import Productos from './pages/Productos';
import { CartProvider } from './context/CartContext'; // <--- Importamos
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <CartProvider> {/* <--- Envolvemos TODO con el proveedor */}
      <Router>
        <Navigation />
        
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<div className="container mt-5"><h2 className="text-center">Sobre Nosotros</h2></div>} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/contacto" element={<div className="container mt-5"><h2 className="text-center">Contáctanos</h2></div>} />
            {/* Pronto crearemos la pagina real del carrito */}
            <Route path="/carrito" element={<div className="container mt-5"><h2 className="text-center">Tu Carrito de Compras</h2></div>} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;