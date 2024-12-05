import React, { useState, useEffect, useRef } from "react";
import "../styles/Modal.css";
import "../styles/Profil.css";
import { deleteEmprunt, updateEmprunt, addEmprunt } from "../Api.js";
import Alert from "../components/Alert";

function ShowLoan({ loan, onClose, updateLoans, isDelete }) {
  const modalRef = useRef(null); // Référence à la modale
  const [currentLoan, setCurrentLoan] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

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
    const fetchLoan = async () => {
      if (!loan) {
        setIsEditing(true);
        return;
      }
      try {
        setCurrentLoan(loan);
      } catch (error) {
        addAlert("Error loading data.", "", "", "error");
      }
    };
    fetchLoan();
  }, [loan]);

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

    // Si le champ est un nombre, convertissez-le en nombre
    const newValue =
      name === "clientId" || name === "livreId" ? parseInt(value) : value;

    setCurrentLoan((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const deleteUser = async () => {
    setLoading(true);
    try {
      // Suppression du loan via l'API
      await deleteEmprunt(loan.id);
      updateLoans({ id: loan.id, ...currentLoan, isNew: false });
      // Ajout d'un message de succès
      addAlert("Loan successfully deleted.", "", "", "success");
      // Fermer la modale
      onClose();
    } catch (error) {
      addAlert("Error deleting loan.", "", "", "error");
    } finally {
      setLoading(false);
    }
  };

  const saveChanges = async () => {
    if (!currentLoan?.clientId || !currentLoan?.livreId) {
      addAlert("Please fill in all fields.", "", "", "error");
      return;
    }
    setLoading(true);
    try {
      const loanData1 = {
        clientId: currentLoan.clientId,
        livreId: currentLoan.livreId,
      };

      const loanData2 = {
        clientId: currentLoan.clientId,
        livreId: currentLoan.livreId,
        dateEmprunt: currentLoan?.dateEmprunt,
        dateRetourPrevue: currentLoan?.dateRetourPrevue,
      };

      const loanData =
        !currentLoan?.dateEmprunt || !currentLoan?.dateRetourPrevue
          ? loanData1
          : loanData2;

      if (!loan) {
        const loanCurrent = await addEmprunt(loanData);

        //mise à jour visuale pour le dateEmprunt et dateRetourPrevue
        if (!currentLoan?.dateEmprunt || !currentLoan?.dateRetourPrevue) {
          setCurrentLoan(loanCurrent);
        }

        addAlert("Borrowing added successfully!", "", "", "success");
        // Met à jour la liste des loans dans LoansPage
        updateLoans({ ...loanCurrent, isNew: true });
      } else {
        //console.log(currentLoan);
        const l = await updateEmprunt(currentLoan);
        //console.log(l);

        // Met à jour la liste des loans dans LoansPage
        updateLoans({ ...loanData, id: currentLoan?.id, isNew: false });
        addAlert("Update successful!", "", "", "success");
      }

      setIsEditing(false);
      // onClose();
    } catch (error) {
      // addAlert("Update failed. Please try again.", "", "", "error");
      // //console.log(error);
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
      } else {
        result = "Error while borrowing the book.";
      }
      addAlert(result, null, null, "warning");
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
        <div className="profileCard">
          <div className="profileInfo">
            <label>Client Id :</label>
            {isEditing ? (
              <input
                type="number"
                name="clientId"
                value={currentLoan?.clientId}
                onChange={handleInputChange}
              />
            ) : (
              <p>{currentLoan?.clientId}</p>
            )}
          </div>
          <div className="profileInfo">
            <label>Book Id :</label>
            {isEditing ? (
              <input
                type="number"
                name="livreId"
                value={currentLoan?.livreId}
                onChange={handleInputChange}
              />
            ) : (
              <p>{currentLoan?.livreId}</p>
            )}
          </div>
          <div className="profileInfo">
            <label>Date Borrowed :</label>
            {isEditing ? (
              <input
                type="date"
                name="dateEmprunt"
                value={currentLoan?.dateEmprunt}
                onChange={handleInputChange}
              />
            ) : (
              <p>{currentLoan?.dateEmprunt}</p>
            )}
          </div>

          <div className="profileInfo">
            <label>Expected Return Date :</label>
            {isEditing ? (
              <input
                type="date"
                name="dateRetourPrevue"
                value={currentLoan?.dateRetourPrevue}
                onChange={handleInputChange}
              />
            ) : (
              <p>{currentLoan?.dateRetourPrevue}</p>
            )}
          </div>

          <div className="profileActions">
            {loading ? (
              <button disabled>Loading...</button>
            ) : isDelete ? (
              <button className="deleteBtn" onClick={() => deleteUser()}>
                Delete
              </button>
            ) : isEditing ? (
              <button onClick={saveChanges}>To safeguard</button>
            ) : (
              <button onClick={() => setIsEditing(true)}>To modify</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowLoan;
