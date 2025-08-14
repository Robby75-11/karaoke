import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // es: https://thoughtless-aigneis-capstone2025-5da74a8a.koyeb.app
  withCredentials: true, // solo true se usi cookie/sessioni
});

export default api;
