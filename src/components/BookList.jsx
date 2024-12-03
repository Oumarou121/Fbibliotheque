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
    try {
      const result = await isInFavorite({ livreId, clientId });
      if (result === "added") {
        addAlert(
          "Le livre a été ajouté aux favoris.",
          "/favoris.html",
          "Voir votre liste.",
          "info"
        );
      } else if (result === "removed") {
        addAlert(
          "Le livre a été retiré des favoris.",
          "/favoris.html",
          "Voir votre liste.",
          "info"
        );
      }
    } catch (error) {
      console.error("Erreur lors de la gestion des favoris :", error);
      addAlert("Une erreur est survenue.", null, null);
    }
  };

  // Gestionnaire du panier
  const CartHandler = async ({ clientId, livreId, quantity }) => {
    try {
      const result = await isInCart({ clientId, livreId, quantity });
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
      await addEmprunt({clientId: userData?.id,livreId: currentBook.id});
      addAlert(
        "Le livre a été emprunté avec succès.",
        "/emprunts",
        "Voir mes emprunts",
        "success"
      );
      setIsModalOpen(false); // Fermer la modale après l'emprunt
    } catch (error) {
      const e = error.toString();
      console.error("Erreur lors de l'emprunt du livre", error);
      var result = "";
      if (e.includes("Emprunt déjà existant pour le client ID:")) {
        result = "Vous avez déjà emprunt ce livre";
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
    }
  };

  // Récupérer les données de l'utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const user = await getClientData(); // Récupérer les données de l'utilisateur
          setUserData(user); // Mettre à jour les données utilisateur
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des données utilisateur",
            error
          );
        }
      }
    };

    fetchUserData();
  }, []);

  //Daily live of hight school boyse

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
                      <BiHeart size={20} /> Favori
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
                      <FaBook size={20} /> Ajouter
                    </button>
                  </div>
                  <button
                    className="action-btn borrow-btn"
                    onClick={() => handleBorrowClick(book)} // Ouvrir la modale d'emprunt
                  >
                    <FaHandHolding size={20} /> Emprunter
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
export const BookImage = ({ bookId = 1, type = "normal" }) => {
  const [imageUrl, setImageUrl] = useState(null);
  useEffect(() => {
    let isMounted = true;

    const fetchImage = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/livres/${bookId}/image`
        );
        if (response.ok) {
          const imageBlob = await response.blob();
          const imageObjectUrl = URL.createObjectURL(imageBlob);
          if (isMounted) setImageUrl(imageObjectUrl);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [bookId, imageUrl]);

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
