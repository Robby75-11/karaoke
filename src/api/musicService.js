import api from "./api";

export const fetchDeezer = async (query) => {
  const res = await api.get(`/api/deezer/search`, {
    params: { q: query },
  });

  return res.data;
};

export const fetchLyricsBySong = async (track) => {
  const res = await api.post(`/api/lyrics/bySong`, {
    deezerId: track.id,
    titolo: track.title,
    artista: track.artist.name,
  });
  return res.data;
};
