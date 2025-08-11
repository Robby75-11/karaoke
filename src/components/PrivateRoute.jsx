import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  // Se l'utente non è loggato, reindirizza alla pagina di login.
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Altrimenti, renderizza i children (la pagina protetta).
  return children;
};

export default PrivateRoute;
