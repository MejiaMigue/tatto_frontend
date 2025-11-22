import { useEffect, useState } from "react";
import API from "../services/api";
import "./Clientes.css"; // Reutilizamos estilos
import tattooBg from "../assets/tattoo-bg.jpg";

function Tatuadores() {
  const [tatuadores, setTatuadores] = useState([]);
  const [formData, setFormData] = useState({ nombre: "", estilo: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    cargarTatuadores();
  }, []);

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
      API.put(`/api/tatuadores/${editId}`, formData)
        .then(() => {
          setFormData({ nombre: "", estilo: "" });
          setEditId(null);
          cargarTatuadores();
        })
        .catch((err) => console.error("Error actualizando tatuador:", err));
    } else {
      // 🔹 Create
      API.post("/api/tatuadores", formData)
        .then(() => {
          setFormData({ nombre: "", estilo: "" });
          cargarTatuadores();
        })
        .catch((err) => console.error("Error creando tatuador:", err));
    }
  };

  const eliminarTatuador = (id) => {
    API.delete(`/api/tatuadores/${id}`)
      .then(() => cargarTatuadores())
      .catch((err) => console.error("Error eliminando tatuador:", err));
  };

  const editarTatuador = (tatuador) => {
    setFormData({ nombre: tatuador.nombre, estilo: tatuador.estilo });
    setEditId(tatuador.id);
  };

  const backgroundStyle = {
    minHeight: "100vh",
    backgroundImage: `url(${tattooBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div className="clientes-container" style={backgroundStyle}>
      <h2>Tatuadores</h2>

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
          type="text"
          name="estilo"
          placeholder="Estilo"
          value={formData.estilo}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editId ? "Actualizar Tatuador" : "Agregar Tatuador"}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setFormData({ nombre: "", estilo: "" });
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
            <th>Estilo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tatuadores.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.nombre}</td>
              <td>{t.estilo}</td>
              <td>
                <button onClick={() => editarTatuador(t)}>Editar</button>
                <button onClick={() => eliminarTatuador(t.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Tatuadores;

