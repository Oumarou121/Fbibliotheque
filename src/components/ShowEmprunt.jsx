import React, { useState, useEffect, useRef } from "react";
import "../styles/Modal.css";
import "../styles/Profil.css";
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

  // const returnBook = async (id) => {
  //   setLoading(true);
  //   try {
  //     await deleteEmprunt(id);
  //     addAlert("The book was returned successfully!", null, null, "success");
  //     updateBooks({ ...book, isNew: false });
  //     onClose();
  //   } catch (error) {
  //     //console.error("Error deleting emprunt", error);
  //     addAlert("Error deleting book.", null, null, "warning");
  //   }finally{
  //     setLoading(false);
  //   }
  // };

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
        <BookImage bookId={book?.id} />
        <div className="profileCard">
          <div className="profileInfo">
            <label>Author :</label>

            <p>{book?.auteur}</p>
          </div>

          <div className="profileInfo">
            <label>Title :</label>

            <p>{book?.titre}</p>
          </div>

          <div className="profileInfo">
            <label>Year of publication :</label>

            <p>{book?.anneePublication}</p>
          </div>

          <div className="profileInfo">
            <label>Description :</label>

            <p>{description}</p>
          </div>

          <div className="profileInfo">
          <label>Book borrowed until :</label>
            <p className={"text-red"}>{currentBook.dateRetourPrevue}</p>
          </div>

          <div className="profileActions">
            {loading ? (
              <button disabled>Loading...</button>
            ) : isDelete ? (
              <button
                className="return-btn"
                onClick={() => handleReturnBook(currentBook?.id)}
              >
                Return
              </button>
            ) : (
              <button className="read-btn" onClick={() => null}>
                <a target="_blank" href={linkRead} rel="noopener noreferrer">
                  To sart read
                </a>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowBorrow;