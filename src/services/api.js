import axios from "axios";

// Usa la URL de Railway en producción
const baseUrl =
  process.env.REACT_APP_API_URL || "https://web-production-bd168.up.railway.app";

const API = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json", // ✅ Asegura que Flask reciba JSON
  },
});

export default API;
