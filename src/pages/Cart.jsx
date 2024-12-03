import React, { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import {
  GetCartByClient,
  getClientData,
  addEmprunt,
  RemoveFromCart,
  getTotalQuantityInCart,
} from "../Api";
import TopBody from "../components/TopBody";
import "../styles/Cart.css";
import Alert from "../components/Alert";
import Modal from "../components/Modal";

const CartBody = () => {
  const [userData, setUserData] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);

  // Ajouter une alerte
  const addAlert = (message, link, linkText, type) => {
    setAlerts((prevAlerts) => [
      ...prevAlerts,
      { message, link, linkText, type, id: Date.now() },
    ]);
  };

  // Supprimer une alerte
  const removeAlert = (id) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  // Ouvrir la modale d'emprunt
  const handleBorrowClick = (book) => {
    setCurrentBook(book); // Sauvegarder le livre sélectionné
    setIsModalOpen(true); // Ouvrir la modale
  };

  // Confirmer l'emprunt du livre
  const confirmBorrow = async () => {
    try {
      // Logique pour emprunter le livre
      // await onBorrowBook(currentBook.id);
      await addEmprunt({clientId: userData?.id, livreId: currentBook.livreId});
      removeHandler(currentBook.id, false);
      addAlert(
        "Le livre a été emprunté avec succès.",
        "/emprunts",
        "Voir mes emprunts",
        "success"
      );
    } catch (error) {
      const e = error.toString();
      console.error("Erreur lors de l'emprunt du livre", error);
      var result = "";
      if (e.includes("Emprunt déjà existant pour le client ID:")) {
        result = "Vous avez déjà emprunt ce livre";
        removeHandler(currentBook.id, false);
      }
      if (e.includes("Livre non disponible : Quantité insuffisante")) {
        result = "Livre non disponible : Quantité insuffisante";
      }
      if (e.includes("Adhérent non trouvé pour le client ID:")) {
        result = "Veillez vous souscrire a un abonnement";
      }
      if (
        e.includes(
          "Le nombre d'emprunts disponibles pour cet adhérent est épuisé"
        )
      ) {
        result =
          "Le nombre d'emprunts disponibles pour cet abonnement est épuisé";
      }
      addAlert(result, null, null, "warning");
    } finally {
      setIsModalOpen(false); // Fermer la modale après l'emprunt
    }
  };

  const removeHandler = async (cartId, isShow = true) => {
    try {
      // Supprimez le livre de la base de données
      await RemoveFromCart(cartId);

      await getTotalQuantityInCart(userData?.id);

      // Supprimez le livre de l'état local
      setCartItems((prevCartItems) =>
        prevCartItems.filter((item) => item.id !== cartId)
      );

      if (isShow) {
        addAlert("Le livre a été supprimé du panier.", null, null, "info");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du livre : ", error);
    }
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Utilisateur non authentifié.");
      }
      try {
        const user = await getClientData();
        const books = await GetCartByClient(user?.id);
        setCartItems(books);
        setUserData(user);
      } catch (error) {
        console.log("Error getting cart", error);
      }
    };

    fetchCartItems();
  }, []);

  return (
    <>
      {isModalOpen && currentBook && (
        <Modal
          currentBook={currentBook}
          confirmBorrow={confirmBorrow}
          setIsModalOpen={setIsModalOpen}
          isBody={false}
        />
      )}

      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          message={alert.message}
          link={alert.link}
          linkText={alert.linkText}
          type={alert.type}
          onClose={() => removeAlert(alert.id)}
        />
      ))}

      <section>
        <div className="shopping">
          <p>Shopping Basket</p>
        </div>

        {cartItems.length > 0 ? (
          <section className="cartContent">
            {cartItems.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                handler1={removeHandler}
                handler2={handleBorrowClick}
                isCart={true}
                isFavorites={false}
              />
            ))}
          </section>
        ) : (
          <div className="cart vide" id="emptyCartMessage">
            <i className="uil uil-shopping-cart-alt"></i>
            <p>Cart Is Empty</p>
          </div>
        )}
      </section>
    </>
  );
};

function Cart() {
  return (
    <>
      <TopBody visibility="true" name="Cart" />
      <CartBody />
    </>
  );
}

export default Cart;
