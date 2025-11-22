import { useEffect, useState } from "react";
import API from "../services/api";
import "./Clientes.css"; // Reutilizamos estilos
import tattooBg from "../assets/tattoo-bg.jpg";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Reporte() {
  const [reporte, setReporte] = useState(null);

  useEffect(() => {
    cargarReporte();
  }, []);

  const cargarReporte = () => {
    API.get("/api/citas/xml", { headers: { Accept: "application/xml" } })
      .then((res) => {
        // Parsear XML a objeto JS
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(res.data, "application/xml");

        const totalGeneral = xmlDoc
          .getElementsByTagName("total_general")[0]
          .textContent;

        const tatuadoresNodes = xmlDoc.getElementsByTagName("tatuador");
        const tatuadores = Array.from(tatuadoresNodes).map((t) => ({
          id: t.getAttribute("id"),
          nombre: t.getAttribute("nombre"),
          estilo: t.getAttribute("estilo"),
          total_citas: t.getElementsByTagName("total_citas")[0].textContent,
          porcentaje: t.getElementsByTagName("porcentaje")[0].textContent,
        }));

        setReporte({ totalGeneral, tatuadores });
      })
      .catch((err) => console.error("Error cargando reporte:", err));
  };

  const backgroundStyle = {
    minHeight: "100vh",
    backgroundImage: `url(${tattooBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div className="clientes-container" style={backgroundStyle}>
      <h2>Reporte de Citas</h2>

      {!reporte ? (
        <p>Cargando reporte...</p>
      ) : (
        <>
          <p>Total de citas en el sistema: {reporte.totalGeneral}</p>

          <table className="clientes-table">
            <thead>
              <tr>
                <th>ID Tatuador</th>
                <th>Nombre</th>
                <th>Estilo</th>
                <th>Total Citas</th>
                <th>Porcentaje</th>
              </tr>
            </thead>
            <tbody>
              {reporte.tatuadores.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.nombre}</td>
                  <td>{t.estilo}</td>
                  <td>{t.total_citas}</td>
                  <td>{t.porcentaje}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Gráfico de barras */}
          <div style={{ maxWidth: "600px", margin: "40px auto" }}>
            <Bar
              data={{
                labels: reporte.tatuadores.map((t) => t.nombre),
                datasets: [
                  {
                    label: "% de citas",
                    data: reporte.tatuadores.map((t) =>
                      parseFloat(t.porcentaje.replace("%", ""))
                    ),
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: { callbacks: { label: (ctx) => `${ctx.raw}%` } },
                  title: {
                    display: true,
                    text: "Porcentaje de citas por tatuador",
                    color: "#fff",
                  },
                },
                scales: {
                  x: {
                    ticks: { color: "#fff" },
                    grid: { color: "rgba(255,255,255,0.1)" },
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      color: "#fff",
                      callback: (value) => `${value}%`,
                    },
                    grid: { color: "rgba(255,255,255,0.1)" },
                  },
                },
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Reporte;
