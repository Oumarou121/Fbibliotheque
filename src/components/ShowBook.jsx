import React, { useState, useEffect, useRef } from "react";
import "../styles/Modal.css";
import "../styles/Profil.css";
import { createLivre, updateLivre, deleteLivre } from "../Api.js";
import Alert from "../components/Alert";
import { BookImage } from "./BookList";

function ShowBook({ currentBook, onClose, updateBooks, isDelete }) {
  const modalRef = useRef(null); // Référence à la modale
  const [book, setBook] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [imageBinary, setImageBinary] = useState(null);

  const handleIsEditing = () => {
    setIsEditing(true);
    setImagePreview(
      `https://bbibliotheque-production.up.railway.app/api/livres/${currentBook?.id}/image`
    );
    setIsPreviewVisible(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        const imBin = reader.result.split(",")[1];
        setImageBinary(imBin);
        //console.log(imBin);
        setIsPreviewVisible(true);
      };
      reader.readAsDataURL(file);
    } else {
      setIsPreviewVisible(false);
    }
  };

  // Fonction pour ouvrir le sélecteur de fichier
  const triggerFileInput = () => {
    document.getElementById("mainImage").click();
  };

  const addAlert = (message, link, linkText, type) => {
    setAlerts((prevAlerts) => [
      ...prevAlerts,
      { message, link, linkText, type, id: Date.now() },
    ]);
  };

  const removeAlert = (id) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  useEffect(() => {
    const fetchBookData = async () => {
      if (!currentBook) {
        setIsEditing(true);
        return;
      }
      try {
        setBook(currentBook);
      } catch (error) {
        addAlert("Error loading member data.", "", "", "error");
      }
    };
    fetchBookData();
  }, [currentBook]);

  // Gère les clics en dehors de la modale
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Ferme la modale
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setBook((prevBook) => ({
      ...prevBook,
      [name]:
        name === "quantite" ||
        name === "nbrEmprunt" ||
        name === "anneePublication"
          ? Number(value)
          : value, // Conversion explicite en nombre
    }));
  };

  const saveChanges = async () => {
    if (!currentBook) {
      if (
        !book?.titre ||
        !book?.auteur ||
        book?.anneePublication < 0 ||
        book?.quantite < 0 ||
        book?.nbrEmprunt < 0 ||
        !imageBinary
      ) {
        addAlert("Please fill in all fields.", "", "", "error");
        return;
      }
    } else {
      if (
        !book?.titre ||
        !book?.auteur ||
        book?.anneePublication < 0 ||
        book?.quantite < 0 ||
        book?.nbrEmprunt < 0
      ) {
        addAlert("Please fill in all fields.", "", "", "error");
        return;
      }
    }

    setLoading(true);
    try {
      const BookData = {
        titre: book.titre,
        auteur: book.auteur,
        anneePublication: book.anneePublication,
        quantite: book.quantite,
        nbrEmprunt: book.nbrEmprunt,
        image: imageBinary || book.image,
        description: book.description || null,
      };

      //console.log(BookData);

      if (!currentBook) {
        //Create
        const bookD = await createLivre(BookData);
        // Met à jour la liste des clients dans BooksPage
        updateBooks({
          ...BookData,
          id: bookD?.id,
          isNew: true,
        });
        setIsEditing(false);
        addAlert("Book added successfully!", "", "", "success");
      } else {
        //Update
        await updateLivre(book?.id, BookData);
        // Met à jour la liste des clients dans BooksPage
        updateBooks({
          ...BookData,
          id: book?.id,
          isNew: false,
        });
        setIsEditing(false);
        addAlert("Update successful!", "", "", "success");
      }
    } catch (error) {
      addAlert("Update failed. Please try again.", "", "", "error");
      //console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async () => {
    setLoading(true);
    try {
      // Suppression du client via l'API
      await deleteLivre(book.id);
      updateBooks({ ...book, isNew: false });
      // Ajout d'un message de succès
      addAlert("Book deleted successfully.", "", "", "success");
      // Fermer la modale
      onClose();
    } catch (error) {
      addAlert("Error deleting book.", "", "", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal2">
      <div className="profileContainer" ref={modalRef}>
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
        {!isEditing ? (
          // <BookImage bookId={book?.id} />
          <div className="bookHeader">
            <BookImage bookId={book?.id} />
            <button className="closeButton" onClick={() => onClose()}>
              &times;
            </button>
          </div>
        ) : (
          <div className="image-section bookHeader">
            <button className="closeButton" onClick={() => onClose()}>
              &times;
            </button>
            {!isPreviewVisible && (
              <div
                id="chooseMainImage"
                className="chooseMainImage"
                onClick={triggerFileInput}
              >
                <i className="uil uil-upload"></i>
              </div>
            )}
            <input
              type="file"
              id="mainImage"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />

            {isPreviewVisible && (
              <img
                id="mainImagePreview"
                src={imagePreview}
                alt="Aperçu de l'image principale"
                style={{ display: "block", maxWidth: "100%", height: "auto" }}
                onClick={triggerFileInput} // Permet de changer l'image en cliquant sur l'aperçu
              />
            )}
          </div>
        )}
        <div className="profileCard">
          <div className="profileInfo">
            <label>Author :</label>
            {isEditing ? (
              <input
                type="text"
                name="auteur"
                value={book?.auteur}
                onChange={handleInputChange}
              />
            ) : (
              <p>{book?.auteur}</p>
            )}
          </div>

          <div className="profileInfo">
            <label>Title :</label>
            {isEditing ? (
              <input
                type="text"
                name="titre"
                value={book?.titre}
                onChange={handleInputChange}
              />
            ) : (
              <p>{book?.titre}</p>
            )}
          </div>

          <div className="profileInfo">
            <label>Year of publication :</label>
            {isEditing ? (
              <input
                type="number"
                name="anneePublication"
                value={book?.anneePublication}
                onChange={handleInputChange}
              />
            ) : (
              <p>{book?.anneePublication}</p>
            )}
          </div>

          <div className="profileInfo">
            <label>Number of loans :</label>
            {isEditing ? (
              <input
                type="number"
                name="nbrEmprunt"
                value={book?.nbrEmprunt}
                onChange={handleInputChange}
              />
            ) : (
              <p>{book?.nbrEmprunt}</p>
            )}
          </div>

          <div className="profileInfo">
            <label>Stock :</label>
            {isEditing ? (
              <input
                type="number"
                name="quantite"
                value={book?.quantite}
                onChange={handleInputChange}
              />
            ) : (
              <p>{book?.quantite}</p>
            )}
          </div>

          <div className="profileActions">
            {loading ? (
              <button disabled>Loading...</button>
            ) : isDelete ? (
              <button className="delete-btn" onClick={() => deleteBook()}>
                Delete
              </button>
            ) : isEditing ? (
              <button onClick={() => saveChanges()}>To safeguard</button>
            ) : (
              <button onClick={() => handleIsEditing()}>To modify</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowBook;
