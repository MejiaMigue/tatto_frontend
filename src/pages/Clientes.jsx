import { useEffect, useState } from "react";
import API from "../services/api";
import "./Clientes.css";
import tattooBg from "../assets/tattoo-bg.jpg";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({ nombre: "", email: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = () => {
    API.get("/api/clientes")
      .then((res) => {
        const data = res.data;
        // 🔹 Aseguramos que siempre sea un array
        setClientes(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Error cargando clientes:", err));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      // 🔹 Update
      API.put(`/api/clientes/${editId}`, formData)
        .then(() => {
          setFormData({ nombre: "", email: "" });
          setEditId(null);
          cargarClientes();
        })
        .catch((err) => console.error("Error actualizando cliente:", err));
    } else {
      // 🔹 Create
      API.post("/api/clientes", formData)
        .then(() => {
          setFormData({ nombre: "", email: "" });
          cargarClientes();
        })
        .catch((err) => console.error("Error creando cliente:", err));
    }
  };

  const eliminarCliente = (id) => {
    API.delete(`/api/clientes/${id}`)
      .then(() => cargarClientes())
      .catch((err) => console.error("Error eliminando cliente:", err));
  };

  const editarCliente = (cliente) => {
    setFormData({ nombre: cliente.nombre, email: cliente.email });
    setEditId(cliente.id);
  };

  const backgroundStyle = {
    minHeight: "100vh",
    backgroundImage: `url(${tattooBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div className="clientes-container" style={backgroundStyle}>
      <h2>Clientes</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="clientes-form">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editId ? "Actualizar Cliente" : "Agregar Cliente"}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setFormData({ nombre: "", email: "" });
              setEditId(null);
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      {/* Listado */}
      <table className="clientes-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(clientes) && clientes.length > 0 ? (
            clientes.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nombre}</td>
                <td>{c.email}</td>
                <td>
                  <button onClick={() => editarCliente(c)}>Editar</button>
                  <button onClick={() => eliminarCliente(c.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay clientes registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Clientes;
