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
  const [isLoading, setIsLoading] = useState(true);

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
      await addEmprunt({
        clientId: userData?.id,
        livreId: currentBook.livreId,
      });
      removeHandler(currentBook.id, false);
      addAlert(
        "The book has been successfully borrowed.",
        "/emprunts",
        "View my loans",
        "success"
      );
    } catch (error) {
      const e = error.toString();
      //console.error("Error while borrowing the book", error);
      var result = "";
      if (e.includes("Emprunt déjà existant pour le client ID:")) {
        result = "You have already borrowed this book";
        removeHandler(currentBook.id, false);
      }
      if (e.includes("Livre non disponible : Quantité insuffisante")) {
        result = "Book not available: Insufficient quantity";
      }
      if (e.includes("Adhérent non trouvé pour le client ID:")) {
        result = "Please make sure you subscribe to a subscription";
      }
      if (
        e.includes(
          "Le nombre d'emprunts disponibles pour cet adhérent est épuisé"
        )
      ) {
        result =
          "The number of loans available for this subscription is exhausted";
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
        addAlert(
          "The book has been removed from the cart.",
          null,
          null,
          "info"
        );
      }
    } catch (error) {
      //console.error("Error deleting book : ", error);
    }
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          addAlert(
            "Please log in to view your cart.",
            "/login",
            "Login",
            "warning"
          );
          setIsLoading(false);
          return;
        }

        const user = await getClientData();
        const books = await GetCartByClient(user?.id);

        setUserData(user);
        setCartItems(books);
      } catch (error) {
        //console.error("Error getting cart", error);
        addAlert(
          "Failed to fetch cart items. Please try again later.",
          null,
          null,
          "error"
        );
      } finally {
        setIsLoading(false);
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

        {isLoading ? (
          <div className="loading">Loading...</div> // Afficher le message de chargement
        ) : cartItems.length > 0 ? (
          <section className="books-grid">
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
