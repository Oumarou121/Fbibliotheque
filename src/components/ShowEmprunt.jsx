import React, { useState, useEffect, useRef } from "react";
import "../styles/howEmprunt.css";
import Alert from "../components/Alert";
import { BookImage } from "./BookList";
import { getLivreById } from "../Api";

function ShowBorrow({ currentBook, onClose, handleReturnBook, isDelete }) {
  const modalRef = useRef(null); // Référence à la modale
  const [book, setBook] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [linkRead, setLinkRead] = useState("");

  const addAlert = (message, link, linkText, type) => {
    setAlerts((prevAlerts) => [
      ...prevAlerts,
      { message, link, linkText, type, id: Date.now() },
    ]);
  };

  const removeAlert = (id) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  const BookDescriptionParser = (input) => {
    const descriptionKey = "Description:";
    const linkKey = "Lien pour plus d'infos:";

    // Extraire la description
    const descriptionStart =
      input.indexOf(descriptionKey) + descriptionKey.length;
    const linkStart = input.indexOf(linkKey);

    const description = input.substring(descriptionStart, linkStart).trim(); // Extraire et nettoyer la description

    // Extraire le lien
    const link = input.substring(linkStart + linkKey.length).trim(); // Extraire et nettoyer le lien

    return { description, link };
  };

  useEffect(() => {
    const fetchBookData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          addAlert(
            "Please log in to read your book.",
            "/login",
            "Login",
            "warning"
          );
          setLoading(false);
          return;
        }
        const data = await getLivreById(currentBook.livreId);
        setBook(data);

        // Parse la description
        const { description, link } = BookDescriptionParser(data.description);
        setDescription(description);
        setLinkRead(link);
      } catch (error) {
        addAlert("Error loading member data.", "", "", "error");
      } finally {
        setLoading(false);
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


  return (
    <div className="bookModal">
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
      <div className="modalContent" ref={modalRef}>
        {/* En-tête avec l'image */}
        <div className="bookHeader">
          <BookImage bookId={book?.id} className="bookCover" />
          <button className="closeButton" onClick={() => onClose()}>
            &times;
          </button>
        </div>

        {/* Informations du livre */}
        <div className="bookBody">
          <h1 className="bookTitle">{book?.titre}</h1>
          <p className="bookAuthor">by {book?.auteur}</p>
          <p className="bookYear">Published: {book?.anneePublication}</p>

          <div className="bookDescription">
            <p>{description}</p>
          </div>

          <div className="bookBorrowInfo">
            <p className="borrowDate">
              <strong>Borrowed until:</strong> {currentBook.dateRetourPrevue}
            </p>
          </div>

          <div className="actions">
            {loading ? (
              <button disabled>Loading...</button>
            ) : isDelete ? (
              <button
                className="actionButton returnAction"
                onClick={() => handleReturnBook(currentBook?.id)}
              >
                Return
              </button>
            ) : (
              <a
                href={linkRead}
                target="_blank"
                rel="noopener noreferrer"
                className="actionButton readButton"
              >
                Start Reading
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowBorrow;
