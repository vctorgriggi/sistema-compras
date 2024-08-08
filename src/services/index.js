import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3333";

export const index = axios.create({
  baseURL: `${apiUrl}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 45000,
});
