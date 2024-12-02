import React, { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import {
  GetFavoritesByClient,
  getClientData,
  RemoveFromFavorite,
  getTotalQuantityInCart,
  isInCart,
} from "../Api";
import TopBody from "../components/TopBody";
import Alert from "../components/Alert";
import "../styles/Cart.css";

const Favorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [userData, setUserData] = useState(null);

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

  const removeHandler = async (favoritesId, isShow = true) => {
    try {
      // Supprimez le livre de la base de données
      await RemoveFromFavorite(favoritesId);

      // await getTotalQuantityInCart(userData?.id);

      // Supprimez le livre de l'état local
      setFavorites((prevCartItems) =>
        prevCartItems.filter((item) => item.id !== favoritesId)
      );

      if (isShow) {
        addAlert("Le livre a été supprimé des favoris.", null, null, "info");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du livre : ", error);
    }
  };

  // Gestionnaire du panier
  const CartHandler = async (livreId) => {
    try {
      const clientId = userData?.id;
      const quantity = 1;
      const result = await isInCart({ clientId, livreId, quantity });
      console.log(clientId, livreId, quantity);
      if (result === "added") {
        addAlert(
          "Le livre a été ajouté au panier.",
          "/cart",
          "Voir votre panier.",
          "info"
        );
      } else if (result === "removed") {
        addAlert(
          "Le livre a été retiré du panier.",
          "/cart",
          "Voir votre panier.",
          "info"
        );
      }
    } catch (error) {
      console.error("Erreur lors de la gestion du panier :", error);
      addAlert("Une erreur est survenue.", null, null);
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Utilisateur non authentifié.");
      }
      try {
        const user = await getClientData();
        const books = await GetFavoritesByClient(user?.id);
        setFavorites(books);
        setUserData(user);
      } catch (error) {
        console.log("Error getting favorites", error);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <>
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
          <p>Shopping Favorites</p>
        </div>

        {favorites.length > 0 ? (
          <section className="cartContent">
            {favorites.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                handler1={removeHandler}
                handler2={CartHandler}
                isCart={false}
                isFavorites={true}
              />
            ))}
          </section>
        ) : (
          <div className="cart vide" id="emptyCartMessage">
            <i className="uil uil-shopping-cart-alt"></i>
            <p>Favorites Is Empty</p>
          </div>
        )}
      </section>
    </>
  );
};

function Favorites() {
  return (
    <>
      <TopBody visibility="true" name="Favoris" />
      <Favorite />
    </>
  );
}

export default Favorites;
