import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Clientes from "./pages/Clientes";
import Tatuadores from "./pages/Tatuadores";
import Citas from "./pages/Citas";
import ReporteCitas from "./pages/ReporteCitas";

function App() {
  return (
    <BrowserRouter>
      <div>
        {/* 🔹 Barra de navegación */}
        <nav style={{ marginBottom: "1rem" }}>
          <Link to="/clientes" style={{ marginRight: "1rem" }}>Clientes</Link>
          <Link to="/tatuadores" style={{ marginRight: "1rem" }}>Tatuadores</Link>
          <Link to="/citas" style={{ marginRight: "1rem" }}>Citas</Link>
          <Link to="/reporte">Reporte</Link>
        </nav>

        {/* 🔹 Rutas principales */}
        <Routes>
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/tatuadores" element={<Tatuadores />} />
          <Route path="/citas" element={<Citas />} />
          <Route path="/reporte" element={<ReporteCitas />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
