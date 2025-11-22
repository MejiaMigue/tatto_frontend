import { useEffect, useState } from "react";
import API from "../services/api";
import "./Clientes.css"; // Reutilizamos estilos
import tattooBg from "../assets/tattoo-bg.jpg";

function Citas() {
  const [citas, setCitas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [tatuadores, setTatuadores] = useState([]);
  const [formData, setFormData] = useState({
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    descripcion: "",
    cliente_id: "",
    tatuador_id: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    cargarCitas();
    cargarClientes();
    cargarTatuadores();
  }, []);

  const cargarCitas = () => {
    API.get("/api/citas")
      .then((res) => setCitas(res.data))
      .catch((err) => console.error("Error cargando citas:", err));
  };

  const cargarClientes = () => {
    API.get("/api/clientes")
      .then((res) => setClientes(res.data))
      .catch((err) => console.error("Error cargando clientes:", err));
  };

  const cargarTatuadores = () => {
    API.get("/api/tatuadores")
      .then((res) => setTatuadores(res.data))
      .catch((err) => console.error("Error cargando tatuadores:", err));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      // 🔹 Update
      API.put(`/api/citas/${editId}`, formData)
        .then(() => {
          resetForm();
          cargarCitas();
        })
        .catch((err) => console.error("Error actualizando cita:", err));
    } else {
      // 🔹 Create
      API.post("/api/citas", formData)
        .then(() => {
          resetForm();
          cargarCitas();
        })
        .catch((err) => console.error("Error creando cita:", err));
    }
  };

  const eliminarCita = (id) => {
    API.delete(`/api/citas/${id}`)
      .then(() => cargarCitas())
      .catch((err) => console.error("Error eliminando cita:", err));
  };

  const editarCita = (cita) => {
    setFormData({
      fecha: cita.fecha,
      hora_inicio: cita.hora_inicio,
      hora_fin: cita.hora_fin,
      descripcion: cita.descripcion,
      cliente_id: cita.cliente_id,
      tatuador_id: cita.tatuador_id,
    });
    setEditId(cita.id);
  };

  const resetForm = () => {
    setFormData({
      fecha: "",
      hora_inicio: "",
      hora_fin: "",
      descripcion: "",
      cliente_id: "",
      tatuador_id: "",
    });
    setEditId(null);
  };

  const backgroundStyle = {
    minHeight: "100vh",
    backgroundImage: `url(${tattooBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div className="clientes-container" style={backgroundStyle}>
      <h2>Citas</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="clientes-form">
        <input
          type="date"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="hora_inicio"
          value={formData.hora_inicio}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="hora_fin"
          value={formData.hora_fin}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
        />

        {/* Selección de cliente */}
        <select
          name="cliente_id"
          value={formData.cliente_id}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar Cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>

        {/* Selección de tatuador */}
        <select
          name="tatuador_id"
          value={formData.tatuador_id}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar Tatuador</option>
          {tatuadores.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre} ({t.estilo})
            </option>
          ))}
        </select>

        <button type="submit">
          {editId ? "Actualizar Cita" : "Agendar Cita"}
        </button>
        {editId && (
          <button type="button" onClick={resetForm}>
            Cancelar
          </button>
        )}
      </form>

      {/* Listado */}
      <table className="clientes-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Hora Inicio</th>
            <th>Hora Fin</th>
            <th>Descripción</th>
            <th>Cliente</th>
            <th>Tatuador</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.fecha}</td>
              <td>{c.hora_inicio}</td>
              <td>{c.hora_fin}</td>
              <td>{c.descripcion}</td>
              <td>{c.cliente?.nombre || c.cliente_id}</td>
              <td>{c.tatuador?.nombre || c.tatuador_id}</td>
              <td>
                <button onClick={() => editarCita(c)}>Editar</button>
                <button onClick={() => eliminarCita(c.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Citas;

