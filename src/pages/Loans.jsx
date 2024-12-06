import React, { useEffect, useState } from "react";
import "../styles/Customers.css";
import {
  getAllEmprunt,
  sendAdminMessage,
  getClientData,
  getEmailById,
  getTitreById,
} from "../Api";
import ShowLoan from "../components/ShowLoan.jsx";
import Alert from "../components/Alert";

const LoansPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [loans, setLoans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLoan, setCurrentLoan] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [userData, setUserData] = useState(null);
  // const currentDate = new Date().toISOString().split("T")[0];
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState(null);

  const addAlert = (message, link, linkText, type) => {
    setAlerts((prevAlerts) => [
      ...prevAlerts,
      { message, link, linkText, type, id: Date.now() },
    ]);
  };

  const removeAlert = (id) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  const handleLoanModal = (loan = null, isDel = false) => {
    setCurrentLoan(loan);
    setIsModalOpen(true);
    setIsDelete(isDel);
  };

  // const compare = (finishDate) => {
  //   if (currentDate > finishDate) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  const compare1 = (finishDate) => {
    const today = new Date();
    const veilleDateRetour = new Date(finishDate); // Crée un objet Date à partir de finishDate
    veilleDateRetour.setDate(veilleDateRetour.getDate() - 1); // Soustrait un jour à finishDate

    // Vérifie si aujourd'hui est la veille ou après
    return today >= veilleDateRetour;
  };

  const compare2 = (finishDate) => {
    const today = new Date();
    const veilleDateRetour = new Date(finishDate); // Crée un objet Date à partir de finishDate

    // Vérifie si aujourd'hui est la veille ou après
    return today >= veilleDateRetour;
  };

  useEffect(() => {
    const getLoans = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const user = await getClientData();
          setUserData(user);
          setRole(user?.role);
          const loans = await getAllEmprunt();
          setLoans(loans);
          setFilteredLoans(loans);
        } catch (error) {
          //console.error("Erreur lors de la récupération des clients", error);
          setLoans([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    getLoans();
  }, []);

  const sendWaring = async (loan) => {
    setLoading(true);
    try {
      const recepteur = await getEmailById(loan.clientId);
      const titre = await getTitreById(loan.livreId);

      const today = new Date();
      const dateRetourPrevue = new Date(loan.dateRetourPrevue);
      const veilleDateRetour = new Date(dateRetourPrevue);
      veilleDateRetour.setDate(dateRetourPrevue.getDate() - 1);

      let message;
      if (today > dateRetourPrevue) {
        message = `Bonjour,
  
        Nous avons constaté que le livre emprunté (Titre : ${titre}) n'a pas été retourné avant la date prévue (${loan.dateRetourPrevue}). Merci de le retourner dans les plus brefs délais.
  
        Cordialement,
        L'équipe de la bibliothèque`;
      } else if (today.toDateString() === veilleDateRetour.toDateString()) {
        message = `Bonjour,
  
        Nous souhaitons vous rappeler que le livre emprunté (Titre : ${titre}) doit être retourné demain (${loan.dateRetourPrevue}). Merci de prendre les dispositions nécessaires.
  
        Cordialement,
        L'équipe de la bibliothèque`;
      } else {
        message = `Bonjour,
  
        Nous souhaitons vous rappeler que le livre emprunté (Titre : ${titre}) est à retourner avant le ${loan.dateRetourPrevue}. Merci d'en prendre note.
  
        Cordialement,
        L'équipe de la bibliothèque`;
      }

      const MessageData = {
        expediteur: userData?.email,
        message: message,
        recepteur: recepteur,
        admin: true,
      };

      //console.log(MessageData);

      await sendAdminMessage(MessageData);
      addAlert(
        "Un avertissement a été envoyé à l'adhérent pour ce livre.",
        "",
        "",
        "success"
      );
    } catch (error) {
      //console.error("Erreur lors de l'envoi du message", error);
      addAlert("Erreur lors de l'envoi du message.", "", "", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      setFilteredLoans(loans); // Affiche tous les emprunts si le terme de recherche est vide
      return;
    }

    const results = loans.filter(
      (loan) =>
        (loan.clientId && String(loan.clientId).includes(searchTerm)) ||
        (loan.livreId && String(loan.livreId).includes(searchTerm)) ||
        (loan.id && String(loan.id).includes(searchTerm))
    );
    setFilteredLoans(results);
  }, [searchTerm, loans]);

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

      {/* Modale de confirmation d'emprunt */}
      {isModalOpen && (
        <ShowLoan
          isDelete={isDelete}
          loan={currentLoan}
          onClose={() => setIsModalOpen(false)}
          updateLoans={(updatedLoan) => {
            if (isDelete) {
              // Supprimer un client
              setLoans((prevLoans) =>
                prevLoans.filter((loan) => loan.id !== updatedLoan.id)
              );
            } else {
              if (!updatedLoan.isNew) {
                // Met à jour un client existant
                setLoans((prevLoans) =>
                  prevLoans.map((loan) =>
                    loan.id === updatedLoan.id ? updatedLoan : loan
                  )
                );
              } else {
                // Ajoute un nouveau client avec un ID généré
                setLoans((prevLoans) => [...prevLoans, updatedLoan]);
              }
            }
          }}
        />
      )}

      <div className="admin-dashboard">
        <h1>Manage Loans</h1>

        <div className="product-actions">
          <input
            type="text"
            id="search"
            placeholder="Search loan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button disabled={role !== "admin"} onClick={() => handleLoanModal()}>Add New Loan</button>
        </div>

        <table id="productTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Client Id</th>
              <th>Livre Id</th>
              <th>Debut</th>
              <th>Fin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <div className="loading">Loading...</div> // Afficher le message de chargement
            ) : role === "admin" ? (
              filteredLoans.map((loan) => {
                return (
                  <tr key={loan.id}>
                    <td
                      className={
                        compare2(loan.dateRetourPrevue)
                          ? "fin"
                          : compare1(loan.dateRetourPrevue)
                          ? "veille"
                          : ""
                      }
                      title={
                        compare2(loan.dateRetourPrevue)
                          ? "Date limite depasse"
                          : compare1(loan.dateRetourPrevue)
                          ? "Veille de la date limite"
                          : ""
                      }
                    >
                      {loan.id}
                    </td>
                    <td>{loan.clientId}</td>
                    <td>{loan.livreId}</td>
                    <td>{loan.dateEmprunt}</td>
                    <td>{loan.dateRetourPrevue}</td>
                    <td className="table-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleLoanModal(loan, false)}
                      >
                        Détails
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleLoanModal(loan, true)}
                      >
                        Delete
                      </button>
                      {compare1(loan.dateRetourPrevue) ? (
                        loading ? (
                          <button disabled>Sending...</button>
                        ) : (
                          <button
                            title="Sending warning"
                            className="send-btn"
                            onClick={() => sendWaring(loan)}
                          >
                            Send warning
                          </button>
                        )
                      ) : null}
                    </td>
                  </tr>
                );
              })
            ) : (
              <p>Unauthenticated user or insufficient access rights</p>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LoansPage;
