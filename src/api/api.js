import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 🔍 Ricerca brani tramite il tuo backend
export const searchTracks = async (query) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/deezer/search`, {
      params: { q: query },
    });
    return res.data;
  } catch (err) {
    console.error("Errore ricerca Deezer:", err);
    throw err;
  }
};
