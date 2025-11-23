import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      {/* 1. La Navbar vive fuera de las Routes para verse siempre */}
      <Navigation />

      {/* 2. Contenedor principal con margen superior para aire visual */}
      <div className="container mt-5">
        <Routes>
          {/* Definimos las rutas (páginas) vacías por ahora */}
          <Route path="/" element={<h1 className="text-center display-5 fw-bold" style={{color: 'var(--color-primary)'}}>Bienvenido a EkiNature</h1>} />
          <Route path="/about" element={<h2 className="text-center">Sobre Nosotros</h2>} />
          <Route path="/productos" element={<h2 className="text-center">Catálogo de Geles</h2>} />
          <Route path="/contacto" element={<h2 className="text-center">Contáctanos</h2>} />
          <Route path="/carrito" element={<h2 className="text-center">Tu Carrito de Compras</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;