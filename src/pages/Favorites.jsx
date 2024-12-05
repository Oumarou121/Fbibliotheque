import React, { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import {
  GetFavoritesByClient,
  getClientData,
  RemoveFromFavorite,
  isInCart,
} from "../Api";
import TopBody from "../components/TopBody";
import Alert from "../components/Alert";
import "../styles/Cart.css";

const Favorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [userData, setUserData] = useState(null);
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
        addAlert(
          "The book has been removed from favorites.",
          null,
          null,
          "info"
        );
      }
    } catch (error) {
      //console.error("Error deleting book: ", error);
    }
  };

  // Gestionnaire du panier
  const CartHandler = async (livreId) => {
    try {
      const clientId = userData?.id;
      const quantity = 1;
      const result = await isInCart({ clientId, livreId, quantity });
      //console.log(clientId, livreId, quantity);
      if (result === "added") {
        addAlert(
          "The book has been added to the cart.",
          "/cart",
          "View your cart.",
          "info"
        );
      } else if (result === "removed") {
        addAlert(
          "The book has been removed from the cart.",
          "/cart",
          "View your cart.",
          "info"
        );
      }
    } catch (error) {
      //console.error("Error while managing the cart:", error);
      addAlert("An error has occurred.", null, null);
    }
  };

  // useEffect(() => {
  //   const fetchFavorites = async () => {
  //     const token = localStorage.getItem("authToken");
  //     if (!token) {
  //       throw new Error("Unauthenticated user.");
  //     }
  //     try {
  //       const user = await getClientData();
  //       const books = await GetFavoritesByClient(user?.id);
  //       setFavorites(books);
  //       setUserData(user);
  //     } catch (error) {
  //       //console.log("Error getting favorites", error);
  //     }
  //   };

  //   fetchFavorites();
  // }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          addAlert(
            "Please log in to view your Favorites.",
            "/login",
            "Login",
            "warning"
          );
          setIsLoading(false);
          return;
        }

        const user = await getClientData();
        const books = await GetFavoritesByClient(user?.id);
        setFavorites(books);
        setUserData(user);
      } catch (error) {
        //console.error("Error getting favorites", error);
        addAlert(
          "Failed to fetch favorites books. Please try again later.",
          null,
          null,
          "error"
        );
      } finally {
        setIsLoading(false);
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

        {isLoading ? (
          <div className="loading">Loading...</div> // Afficher le message de chargement
        ) : favorites.length > 0 ? (
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
      <TopBody visibility="true" name="Favorites" />
      <Favorite />
    </>
  );
}

export default Favorites;
