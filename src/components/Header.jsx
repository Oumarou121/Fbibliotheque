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

function Header() {
  const [activeLink, setActiveLink] = useState("/");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Fonction pour changer le lien actif
  const handleLinkClick = (link) => {
    setActiveLink(link);
    setIsMenuOpen(false);
  };

  // Fonction pour basculer le menu mobile
  const toggleMenu = () => {
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
          console.error(
            "Erreur lors de la récupération des données utilisateur :",
            error
          );
          setIsAuthenticated(false);
        }
      }
    };

    fetchUserData();
  }, []);

  // Mettre à jour activeLink à chaque changement de l'URL
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);
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
          <button
            className="mobile-close-btn"
            data-visible={isMenuOpen}
            aria-controls="primary-navigation"
            onClick={toggleMenu}
          >
            <i className="uil uil-times-circle"></i>
          </button>
          <nav>
            <ul
              id="primary-navigation"
              data-visible={isMenuOpen}
              className={`primary-navigation flex ${
                isMenuOpen ? "visible" : ""
              }`}
            >
              <li>
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
                  />
                </div>
                <div id="logout-btn" onClick={logoutClient}>
                  <div className="bbb text-red uil fs-150">
                    <i className="uil fs-150 text-red uil-signout"></i>
                    Déconnexion
                  </div>
                </div>
              </div>
            </div>
          </div>

          <i className="uil uil-search"></i>
          {/* <i
            id="cart-box"
            className="cart-book uil uil-book"
            data-quantity="0"
            onClick={navigation}
          ></i>
          <i className="uil uil-envelope-check" data-quantity="0"></i> */}
        </div>

        <div className="mobile-open-btn" onClick={toggleMenu}>
          <i className="uil uil-align-right"></i>
        </div>
      </header>
    );
  } else {
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
          <button
            className="mobile-close-btn"
            data-visible={isMenuOpen}
            aria-controls="primary-navigation"
            onClick={toggleMenu}
          >
            <i className="uil uil-times-circle"></i>
          </button>
          <nav>
            <ul
              id="primary-navigation"
              data-visible={isMenuOpen}
              className={`primary-navigation flex ${
                isMenuOpen ? "visible" : ""
              }`}
            >
              <li>
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
                  Abonnement
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
                <div id="logout-btn" onClick={logoutClient}>
                  <div className="bbb text-red uil fs-150" href="#">
                    <i className="uil fs-150 text-red uil-signout"></i>
                    Déconnexion
                  </div>
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
    );
  }
}

function Profil({ isAuthenticated, userData }) {
  return (
    <>
      {isAuthenticated && userData ? (
        <Link className="bbb text-black uil fs-150" to="/profil">
          <i className="uil fs-150 uil-user"></i>
          {userData?.nom || "Profil"}
        </Link>
      ) : (
        <Link className="bbb text-black uil fs-150" to="/login">
          <i className="uil fs-150 uil-user"></i> Se connecter
        </Link>
      )}
    </>
  );
}

export default Header;


// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import "../styles/Header1.css";

// function Header() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isShadow, setIsShadow] = useState(false);
//   const location = useLocation();

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsShadow(window.scrollY > 0);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   return (
//     <header className={`navbar ${isShadow ? "shadow" : ""}`}>
//       <div className="container">
//         <Link className="navbar-brand" to="/">
//           <p>
//             <span className="b">Medo </span>shop
//           </p>
//         </Link>
//         <button className="navbar-toggler" onClick={toggleMenu}>
//           <span className="toggler-icon"></span>
//         </button>
//         <nav className={`navbar-collapse ${isMenuOpen ? "open" : ""}`}>
//           <ul className="navbar-nav">
//             <li className="nav-item">
//               <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} to="/">
//                 Home
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link className={`nav-link ${location.pathname === "/shop" ? "active" : ""}`} to="/shop">
//                 Shop
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link className={`nav-link ${location.pathname === "/collection" ? "active" : ""}`} to="/collection">
//                 Collection
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link className={`nav-link ${location.pathname === "/contact" ? "active" : ""}`} to="/contact">
//                 Contact Us
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} to="/about">
//                 About
//               </Link>
//             </li>
//           </ul>
//           <div className="navbar-actions">
//             <button className="btn search-btn">
//               <i className="uil uil-search"></i>
//             </button>
//             <Link to="/cart" className="btn cart-btn">
//               <i className="uil uil-shopping-cart"></i>
//               <span className="badge">0</span>
//             </Link>
//             <Link to="/login" className="btn login-btn">
//               <i className="uil uil-user"></i>
//             </Link>
//           </div>
//         </nav>
//       </div>
//     </header>
//   );
// }

// export default Header;
