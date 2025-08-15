// src/api/musicService.js
import api from "./api.js"; // Axios con token già configurato

/**
 * 🔍 Cerca brani su Deezer tramite il backend
 * @param {string} query - Testo di ricerca (titolo o artista)
 */
export const fetchDeezer = async (query) => {
  const res = await api.get(`/api/deezer/search`, {
    params: { q: query },
  });
  return res.data;
};

/**
 * 🎤 Recupera i testi di una canzone
 * @param {number|string} songId - ID della canzone (può essere quello locale o Deezer)
 * @param {string} [title] - Titolo del brano (opzionale, per fallback API esterna)
 * @param {string} [artist] - Nome artista (opzionale, per fallback API esterna)
 */
export const fetchLyricsBySong = async (songId, title, artist) => {
  const params = {};
  if (title) params.title = title;
  if (artist) params.artist = artist;

  const res = await api.get(`/api/lyrics/${songId}`, { params });
  return res.data;
};

/**
 * 🎼 Recupera tutti i brani locali salvati
 */
export const fetchAllSongs = async () => {
  const res = await api.get(`/api/songs`);
  return res.data;
};

/**
 * 🎼 Recupera un singolo brano locale per ID
 */
export const fetchSongById = async (id) => {
  const res = await api.get(`/api/songs/${id}`);
  return res.data;
};

// ✅ Esportiamo tutto
export { fetchDeezer, fetchLyricsBySong, fetchAllSongs, fetchSongById };
