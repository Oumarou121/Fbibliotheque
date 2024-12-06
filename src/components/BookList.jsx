import React, { useState, useEffect } from "react";
import { BiHeart } from "react-icons/bi";
import { FaBook, FaHandHolding } from "react-icons/fa";
import "../styles/BookList.css";
import { getClientData, isInFavorite, isInCart, addEmprunt } from "../Api";
import Alert from "./Alert";
import Modal from "./Modal";

export const BookList = ({ name, books, onBorrowBook }) => {
  const [userData, setUserData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const token = localStorage.getItem("authToken");

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

  // Gestionnaire des favoris
  const FavoriteHandler = async ({ livreId, clientId }) => {
    if (!token) {
      addAlert("You must be logged in to add favorite.", "", "", "warning");
      return;
    }
    try {
      const result = await isInFavorite({ livreId, clientId });
      if (result === "added") {
        addAlert(
          "The book has been added to favorites.",
          "/favorites",
          "View your list.",
          "info"
        );
      } else if (result === "removed") {
        addAlert(
          "The book has been removed from favorites.",
          "/favorites",
          "View your list.",
          "info"
        );
      }
    } catch (error) {
      console.error("Error while managing favorites:", error);
      addAlert("An error has occurred.", null, null);
    }
  };

  // Gestionnaire du panier
  const CartHandler = async ({ clientId, livreId, quantity }) => {
    if (!token) {
      addAlert("You must be logged in to add cart.", "", "", "warning");
      return;
    }
    try {
      const result = await isInCart({ clientId, livreId, quantity });
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
      console.error("Error while managing the cart:", error);
      addAlert("An error has occurred.", null, null);
    }
  };

  // Ouvrir la modale d'emprunt
  const handleBorrowClick = (book) => {
    setCurrentBook(book); 
    setIsModalOpen(true);
  };

  // Confirmer l'emprunt du livre
  const confirmBorrow = async () => {
    if (!token) {
      addAlert("You must be logged in to borrow book.", "", "", "warning");
      return;
    }
    try {
      // Logique pour emprunter le livre
      // await onBorrowBook(currentBook.id);
      await addEmprunt({ clientId: userData?.id, livreId: currentBook.id });
      addAlert(
        "The book has been successfully borrowed.",
        "/emprunts",
        "View my loans",
        "success"
      );
      setIsModalOpen(false); // Fermer la modale après l'emprunt
    } catch (error) {
      const e = error.toString();
      //console.error("Error while borrowing the book", error);
      var result = "";
      if (e.includes("Emprunt déjà existant pour le client ID:")) {
        result = "You have already borrowed this book";
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
          "The number of loans available for this subscription is exhausted.";
      }
      addAlert(result, null, null, "warning");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const user = await getClientData(); 
          setUserData(user); 
        } catch (error) {
          //console.error("Error retrieving user data", error);
        }
      }
    };

    fetchUserData();
  }, []);


  return (
    <>
      {/* Modale de confirmation d'emprunt */}
      {isModalOpen && currentBook && (
        <Modal
          currentBook={currentBook}
          confirmBorrow={confirmBorrow}
          setIsModalOpen={setIsModalOpen}
        />
      )}

      <div className="booklist-container">
        {/* Affichage des alertes */}
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

        <h2 className="booklist-title">{name}</h2>
        <div className="books-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              <BookImage bookId={book.id} />
              <div className="book-info">
                <h3 className="book-title">{book.titre}</h3>
                <p className="book-author">by {book.auteur}</p>
                <div className="book-actions">
                  <div className="top-actions">
                    <button
                      className="action-btn favorite-btn"
                      onClick={() =>
                        FavoriteHandler({
                          clientId: userData?.id,
                          livreId: book.id,
                        })
                      }
                    >
                      <BiHeart size={20} /> Favorite
                    </button>
                    <button
                      className="action-btn cart-btn"
                      onClick={() =>
                        CartHandler({
                          clientId: userData?.id,
                          livreId: book.id,
                          quantity: 1,
                        })
                      }
                    >
                      <FaBook size={20} /> Add
                    </button>
                  </div>
                  <button
                    className="action-btn borrow-btn"
                    onClick={() => handleBorrowClick(book)} // Ouvrir la modale d'emprunt
                  >
                    <FaHandHolding size={20} /> Borrow
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// Composant pour afficher l'image du livre
// export const BookImage = ({ bookId = 1, type = "normal" }) => {
//   const [imageUrl, setImageUrl] = useState(null);
//   useEffect(() => {
//     let isMounted = true;

//     const fetchImage = async () => {
//       try {
//         const response = await fetch(
//           `https://bbibliotheque-production.up.railway.app/api/livres/${bookId}/image`
//         );
//         if (response.ok) {
//           const imageBlob = await response.blob();
//           const imageObjectUrl = URL.createObjectURL(imageBlob);
//           if (isMounted) setImageUrl(imageObjectUrl);
//         }
//       } catch (error) {
//         //console.error("Error fetching image:", error);
//       }
//     };

//     fetchImage();

//     return () => {
//       isMounted = false;
//       if (imageUrl) {
//         URL.revokeObjectURL(imageUrl);
//       }
//     };
//   }, [bookId, imageUrl]);

//   return (
//     <div>
//       {imageUrl ? (
//         <img src={imageUrl} className={`book-image-${type}`} alt="Book" />
//       ) : (
//         <p>Loading image...</p>
//       )}
//     </div>
//   );
// };

export const BookImage = ({ bookId = 1, type = "normal" }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    // Mettez à jour l'URL de l'image lorsque bookId change
    setImageUrl(
      `https://bbibliotheque-production.up.railway.app/api/livres/${bookId}/image`
    );
  }, [bookId]); // Utilisez bookId comme dépendance

  return (
    <div>
      {imageUrl ? (
        <img src={imageUrl} className={`book-image-${type}`} alt="Book" />
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
};
