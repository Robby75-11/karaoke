import api from "./api";

// Deezer via backend
export const fetchDeezer = async (query) => {
  const res = await api.get(`/api/deezer/search`, {
    params: { q: query },
  });
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

// Lyrics via backend con fallback title/artist
export const fetchLyricsBySong = async (track) => {
  const params = {
    title: track?.title || "",
    artist: track?.artist?.name || "",
  };
  const res = await api.get(`/api/lyrics/${track.id}`, { params });
  if (typeof res.data?.lyrics === "string") {
    return { lyrics: res.data.lyrics, sync: res.data.sync ?? "[]" };
  }
  throw new Error("La risposta del backend non contiene 'lyrics'.");
};
