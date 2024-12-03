// src/App.jsx
import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Abonnement from "./pages/Abonnement";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Messages from "./pages/MessagesClient";
import LoginModal from "./pages/Login";
import BorrowedBooks from "./pages/BorrowedBooks";
import Favorites from "./pages/Favorites";
import Cart from "./pages/Cart";
import UserProfile from "./pages/profil";
import DashboardPage from "./pages/Dashboard";
import CustomersPage from "./pages/Customers";
import ProductsPage from "./pages/Products";
import MessagesPage from "./pages/Messages";
import LoansPage from "./pages/Loans";
import { LoaderProvider } from "./LoaderContext";
import Loader from "./components/Loader";

function AppContent() {
  const location = useLocation(); // Hook ici, garanti dans le contexte du Router
  const hideHeaderFooter = location.pathname === "/login" || "/messages"; // Vérifie si on est sur `/profil`
  const isAdminPage = location.pathname.includes("admin"); // Vérifie si l'URL contient "admin"
  const hideHeader = location.pathname === "/login";

  return (
    <div>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/abonnement" element={<Abonnement />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<LoginModal />} />
        <Route path="/emprunts" element={<BorrowedBooks />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profil" element={<UserProfile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/admin/products" element={<ProductsPage />} />
        <Route path="/admin/customers" element={<CustomersPage />} />
        <Route path="/admin/loans" element={<LoansPage />} />
        <Route path="/admin/messages" element={<MessagesPage />} />
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
      {!hideHeaderFooter && <Footer isAdmin={isAdminPage} />}{" "}
      {/* Masque le Footer sur `/profil` */}
    </div>
  );
}

function App() {
  return (
    <LoaderProvider>
      <Loader /> {/* Affichage du Loader */}
      <Router>
        <AppContent />{" "}
        {/* AppContent utilise maintenant useLocation dans le bon contexte */}
      </Router>
    </LoaderProvider>
  );
}

export default App;
