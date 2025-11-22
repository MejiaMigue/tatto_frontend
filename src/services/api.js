import axios from "axios";

const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json", // ✅ Asegura que Flask reciba JSON
  },
});

export default API;
