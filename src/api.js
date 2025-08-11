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
  if (auth) {
    try {
      if (typeof __initial_auth_token !== "undefined") {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    } catch (error) {
      console.error("Errore di autenticazione:", error);
    }
  }
};

authenticate();

// Funzione per cercare brani, rimane invariata
export const fetchDeezer = async (query) => {
  const url = `/api/search?q=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Errore nella chiamata API di Deezer:", error);
    return [];
  }
};

// Funzione per recuperare i testi: ora fa solo una chiamata al backend
export const fetchLyricsBySongId = async (trackId) => {
  console.log(
    "Tentativo di recuperare i testi dal backend per il brano con ID:",
    trackId
  );

  try {
    // ✅ Correzione: Chiamiamo il nostro endpoint backend per i testi
    const response = await fetch(`http://localhost:8080/api/lyrics/${trackId}`);

    if (!response.ok) {
      throw new Error(
        `Errore dal server backend: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Risposta del backend per i testi:", data);

    if (data.lyrics) {
      return { lyrics: data.lyrics };
    } else {
      throw new Error("La risposta del backend non contiene i testi.");
    }
  } catch (error) {
    console.error("Errore nel recupero dei testi:", error);
    return { error: "Impossibile recuperare i testi." };
  }
};
