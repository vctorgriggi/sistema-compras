import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3333";

export const index = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  // withCredentials: true, // habilitar se necessário para CORS com credenciais
});
