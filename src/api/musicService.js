import api from "./api.js";

export const fetchDeezer = async (artist = "", title = "") => {
  let query = "";
  if (artist && title) {
    query = `artist:"${artist}" track:"${title}"`;
  } else {
    query = artist || title;
  }

  const response = await api.get("/api/deezer/search", {
    params: { q: query },
  });

  // Deezer risponde con { data: [ brani ] }
  return response.data;
};
