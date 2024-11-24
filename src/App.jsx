// src/App.jsx
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Abonnement from "./pages/Abonnement";
import About from "./pages/About";
import Contact from "./pages/Contact";
import LoginModal from "./pages/Login";
import { LoaderProvider } from "./LoaderContext";
import Loader from "./components/Loader";

function AppContent() {
  const location = useLocation(); // Hook ici, garanti dans le contexte du Router
  const hideHeaderFooter = location.pathname === "/login"; // Vérifie si on est sur `/profil`

  return (
    <div>
      {!hideHeaderFooter && <Header />} {/* Masque le Header sur `/profil` */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/abonnement" element={<Abonnement />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<LoginModal />} />
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>

      {!hideHeaderFooter && <Footer />} {/* Masque le Footer sur `/profil` */}
    </div>
  );
}

function App() {
  return (
    <LoaderProvider>
      <Loader /> {/* Affichage du Loader */}
      <Router>
        <AppContent /> {/* AppContent utilise maintenant useLocation dans le bon contexte */}
      </Router>
    </LoaderProvider>
    
  );
}

export default App;