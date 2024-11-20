// src/App.jsx
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Libary from "./pages/Libary";
import Abonnement from "./pages/Abonnement";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";

function AppContent() {
  const location = useLocation(); // Hook ici, garanti dans le contexte du Router
  const hideHeaderFooter = location.pathname === "/login"; // Vérifie si on est sur `/profil`

  return (
    <div>
      {!hideHeaderFooter && <Header />} {/* Masque le Header sur `/profil` */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/libary" element={<Libary />} />
        <Route path="/abonnement" element={<Abonnement />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>

      {!hideHeaderFooter && <Footer />} {/* Masque le Footer sur `/profil` */}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent /> {/* AppContent utilise maintenant useLocation dans le bon contexte */}
    </Router>
  );
}

export default App;