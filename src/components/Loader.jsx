import React from "react";
import { useLoader } from "../LoaderContext";
import "../styles/Loader.css";

const Loader = () => {
  const { isLoading } = useLoader();

  if (!isLoading) return null; // Ne pas afficher si `isLoading` est false

  return (
    <div className="loader-overlay">
      <div className="loader">Loading...</div>
    </div>
  );
};

export default Loader;
