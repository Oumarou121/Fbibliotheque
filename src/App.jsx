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
  const location = useLocation(); // Hook pour obtenir la localisation actuelle

  // Déterminer si le header et/ou footer doivent être masqués
  const hideHeaderFooter = ["/messages", "/profil"].includes(location.pathname); // Pages spécifiques
  const isAdminPage = location.pathname.includes("admin"); // Pages Admin

  //console.log("Hide Header/Footer:", hideHeaderFooter);

  return (
    <div>
      {/* Affiche le header sauf si hideHeader est vrai */}
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/abonnement" element={<Abonnement />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* <Route path="/login" element={<LoginModal />} /> */}
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
      {/* Affiche le footer sauf si hideHeaderFooter est vrai */}
      {!hideHeaderFooter && <Footer isAdmin={isAdminPage} />}
    </div>
  );
}

function App() {
  return (
    <LoaderProvider>
      <Loader /> {/* Affichage du Loader */}
      <Router>
        <AppContent />
      </Router>
    </LoaderProvider>
  );
}

export default App;
