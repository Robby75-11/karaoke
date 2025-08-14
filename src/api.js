import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig =
  typeof __firebase_config !== "undefined" ? JSON.parse(__firebase_config) : {};
const firebaseApp = firebaseConfig.apiKey
  ? initializeApp(firebaseConfig)
  : null;
const auth = firebaseApp ? getAuth(firebaseApp) : null;
const db = firebaseApp ? getFirestore(firebaseApp) : null;

const authenticate = async () => {
  if (!auth) return;
  try {
    if (typeof __initial_auth_token !== "undefined") {
      await signInWithCustomToken(auth, __initial_auth_token);
    } else {
      await signInAnonymously(auth);
    }
  } catch (error) {
    console.error("Errore di autenticazione:", error);
  }
};

authenticate();

// Deezer via backend
export const fetchDeezer = async (query) => {
  const res = await fetch(`/api/deezer/search?q=${encodeURIComponent(query)}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Deezer proxy: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data?.data) ? data.data : [];
};

// Lyrics via backend con fallback title/artist
export const fetchLyricsBySong = async (track) => {
  const params = new URLSearchParams({
    title: track?.title || "",
    artist: track?.artist?.name || "",
  });
  const res = await fetch(`/api/lyrics/${track.id}?${params.toString()}`, {
    credentials: "include",
  });
  if (!res.ok)
    throw new Error(`Errore backend: ${res.status} ${res.statusText}`);
  const data = await res.json();
  if (typeof data?.lyrics === "string") {
    return { lyrics: data.lyrics, sync: data.sync ?? "[]" };
  }
  throw new Error("La risposta del backend non contiene 'lyrics'.");
};
