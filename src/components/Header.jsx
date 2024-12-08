import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Header.css";
import {
  logoutClient,
  getClientData,
  getTotalQuantityInCart,
  getTotalMessageInCart,
} from "../Api";
import { useNavigate } from "react-router-dom";
import ShowLogin from "../components/ShowLogin";

function Header() {
  const [activeLink, setActiveLink] = useState("/");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fonction pour changer le lien actif
  const handleLinkClick = (link) => {
    setActiveLink(link);
    setIsMenuOpen(false);
  };

  const handleLoginModal = () => {
    setIsModalOpen(true);
  };

  // Fonction pour basculer le menu mobile
  const toggleMenu = () => {
    if (isMenuOpen) {
    } else {
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const navigation = () => {
    navigate("/cart");
  };

  const navigation1 = () => {
    navigate("/messages");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const user = await getClientData();
          setIsAuthenticated(true);
          setUserData(user);
          // Récupérer la quantité totale dans le panier
          await getTotalQuantityInCart(user?.id);
          await getTotalMessageInCart();
        } catch (error) {
          //console.error(
          //  "Erreur lors de la récupération des données utilisateur :",
          //  error
          //);
          setIsAuthenticated(false);
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isModalOpen]);

  // Mettre à jour activeLink à chaque changement de l'URL
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const handleLogOut = async () => {
    await logoutClient();
  };
  //userData?.role === "admin"
  if (userData?.role === "admin") {
    return (
      <header className="primary-header container flex">
        <div className="header-inner-one flex">
          <div className="logo">
            <img
              src="/logo.png"
              style={{ width: "50px", height: "50px" }}
              alt="Logo"
            />
          </div>
          <nav>
            <ul
              id="primary-navigation"
              data-visible={isMenuOpen}
              className={`primary-navigation flex ${
                isMenuOpen ? "visible" : ""
              }`}
            >
              <li>
                <li>
                  <Link
                    className="back-btn fs-100 fs-montserrat bold-500"
                    onClick={() => toggleMenu()}
                  >
                    <i className="uil text-black uil-times-circle"></i>
                  </Link>
                </li>
                <Link
                  className={`fs-100 fs-montserrat bold-500 ${
                    activeLink === "/admin" ? "active" : ""
                  }`}
                  to="/admin"
                  onClick={() => handleLinkClick("/admin")}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  className={`fs-100 fs-montserrat bold-500 ${
                    activeLink === "/admin/customers" ? "active" : ""
                  }`}
                  to="/admin/customers"
                  onClick={() => handleLinkClick("/admin/customers")}
                >
                  Customers
                </Link>
              </li>
              <li>
                <Link
                  className={`fs-100 fs-montserrat bold-500 ${
                    activeLink === "/admin/products" ? "active" : ""
                  }`}
                  to="/admin/products"
                  onClick={() => handleLinkClick("/admin/products")}
                >
                  Products
                </Link>
              </li>

              <li>
                <Link
                  className={`fs-100 fs-montserrat bold-500 ${
                    activeLink === "/admin/loans" ? "active" : ""
                  }`}
                  to="/admin/loans"
                  onClick={() => handleLinkClick("/admin/loans")}
                >
                  Loans
                </Link>
              </li>

              <li>
                <Link
                  className={`fs-100 fs-montserrat bold-500 ${
                    activeLink === "/admin/messages" ? "active" : ""
                  }`}
                  to="/admin/messages"
                  onClick={() => handleLinkClick("/admin/messages")}
                >
                  Messages
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="header-login flex">
          <div className="menu-bar">
            <div className="dropdown1">
              <div className="dropbtn fs-100 fs-montserrat bold-500 text-black">
                <i className="uil uil-user"></i> Profil
              </div>
              <div className="dropdown-content">
                <div id="login-show">
                  <Profil
                    isAuthenticated={isAuthenticated}
                    userData={userData}
                    handleLoginModal={handleLoginModal}
                  />
                </div>
                <div id="logout-btn" onClick={handleLogOut}>
                  <a role="button" className="bbb text-red uil fs-150">
                    <i className="uil fs-150 text-red uil-signout"></i>
                    Déconnexion
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="admin">
            <i className="uil uil-search"></i>
            <i
              id="cart-box"
              className="cart-book uil uil-book"
              data-quantity="0"
              onClick={navigation}
            ></i>
            <i
              id="message-box"
              className="uil uil-envelope-check"
              data-quantity="0"
              onClick={navigation1}
            ></i>
          </div>
        </div>

        <div className="mobile-open-btn" onClick={toggleMenu}>
          <i className="uil uil-align-right"></i>
        </div>
      </header>
    );
  } else {
    return (
      <>
        {isModalOpen && <ShowLogin onClose={() => setIsModalOpen(false)} />}
        <header className="primary-header container flex">
          <div className="header-inner-one flex">
            <div className="logo">
              <img
                src="/logo.png"
                style={{ width: "50px", height: "50px" }}
                alt="Logo"
              />
            </div>
            <nav>
              <ul
                id="primary-navigation"
                data-visible={isMenuOpen}
                className={`primary-navigation flex ${
                  isMenuOpen ? "visible" : ""
                }`}
              >
                <li>
                  <li>
                    <Link
                      className="back-btn fs-100 fs-montserrat bold-500"
                      onClick={() => toggleMenu()}
                    >
                      <i className="uil text-black uil-times-circle"></i>
                    </Link>
                  </li>

                  <Link
                    className={`fs-100 fs-montserrat bold-500 ${
                      activeLink === "/" ? "active" : ""
                    }`}
                    to="/"
                    onClick={() => handleLinkClick("/")}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    className={`fs-100 fs-montserrat bold-500 ${
                      activeLink === "/library" ? "active" : ""
                    }`}
                    to="/library"
                    onClick={() => handleLinkClick("/library")}
                  >
                    Library
                  </Link>
                </li>
                <li>
                  <Link
                    className={`fs-100 fs-montserrat bold-500 ${
                      activeLink === "/abonnement" ? "active" : ""
                    }`}
                    to="/abonnement"
                    onClick={() => handleLinkClick("/abonnement")}
                  >
                    Subscription
                  </Link>
                </li>
                <li>
                  <Link
                    className={`fs-100 fs-montserrat bold-500 ${
                      activeLink === "/about" ? "active" : ""
                    }`}
                    to="/about"
                    onClick={() => handleLinkClick("/about")}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    className={`fs-100 fs-montserrat bold-500 ${
                      activeLink === "/contact" ? "active" : ""
                    }`}
                    to="/contact"
                    onClick={() => handleLinkClick("/contact")}
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="header-login flex">
            <div className="menu-bar">
              <div className="dropdown1">
                <div className="dropbtn fs-100 fs-montserrat bold-500 text-black">
                  <i className="uil uil-user"></i> Profil
                </div>
                <div className="dropdown-content">
                  <div id="login-show">
                    <Profil
                      isAuthenticated={isAuthenticated}
                      userData={userData}
                      handleLoginModal={handleLoginModal}
                    />
                  </div>
                  <div>
                    <Link className="bbb text-black uil fs-150" to="/emprunts">
                      <i className="uil fs-150 uil-book"></i>Vos Emprunts
                    </Link>
                  </div>
                  <div>
                    <Link className="bbb text-black uil fs-150" to="/favorites">
                      <i className="uil fs-150 uil-heart-alt"></i>Favoris
                    </Link>
                  </div>
                  <div id="logout-btn" onClick={handleLogOut}>
                    <a role="button" className="bbb log text-red uil fs-150">
                      <i className="uil fs-150 text-red uil-signout"></i>
                      Déconnexion
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <i className="uil uil-search"></i>
            <i
              id="cart-box"
              className="cart-book uil uil-book"
              data-quantity="0"
              onClick={navigation}
            ></i>
            <i
              id="message-box"
              className="uil uil-envelope-check"
              data-quantity="0"
              onClick={navigation1}
            ></i>
          </div>

          <div className="mobile-open-btn" onClick={toggleMenu}>
            <i className="uil uil-align-right"></i>
          </div>
        </header>
      </>
    );
  }
}

function Profil({ isAuthenticated, userData, handleLoginModal }) {
  const truncateByLetters = (message, charLimit = 10) => {
    if (message.length > charLimit) {
      return message.slice(0, charLimit) + " ...";
    }
    return message;
  };

  return (
    <>
      {isAuthenticated && userData ? (
        <Link className="bbb text-black uil fs-150" to="/profil">
          <i className="uil fs-150 uil-user"></i>
          {truncateByLetters(userData?.nom) || "Profil"}
        </Link>
      ) : (
        <Link
          onClick={() => handleLoginModal()}
          className="bbb text-black uil fs-150"
        >
          <i className="uil fs-150 uil-user"></i>Se connecter
        </Link>
      )}
    </>
  );
}

export default Header;
