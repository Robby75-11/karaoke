import React, { createContext, useContext, useState } from "react";

// Crea il contesto di autenticazione
const AuthContext = createContext(null);

// Un hook personalizzato per usare il contesto
export const useAuth = () => {
  return useContext(AuthContext);
};

// Il provider che avvolge l'intera applicazione
export const AuthProvider = ({ children }) => {
  // Lo stato dell'utente. Può essere un oggetto (se loggato) o null (se non lo è).
  const [user, setUser] = useState(null);

  // Funzione per il login
  const login = (userData) => {
    // Salva i dati dell'utente, ad esempio il token JWT
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Funzione per il logout
  const logout = () => {
    // Rimuove i dati dell'utente
    localStorage.removeItem("user");
    setUser(null);
  };

  // Il valore del contesto che verrà fornito ai componenti
  const value = {
    user,
    login,
    logout,
    isLoggedIn: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
