import React, { createContext, useState, useContext } from "react";

// Créer le contexte
const LoaderContext = createContext();

// Fournisseur du contexte
export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  return (
    <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useLoader = () => useContext(LoaderContext);
