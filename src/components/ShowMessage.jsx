import React, { useState, useEffect, useRef } from "react";
import "../styles/Modal.css";
import "../styles/Profil.css";
import { deleteMessage, sendAdminMessage } from "../Api.js";
import Alert from "../components/Alert";

function ShowMessage({
  currentMessage,
  onClose,
  updateMessages,
  isDelete,
  adminEmail,
}) {
  const modalRef = useRef(null); // Référence à la modale
  const [message, setMessage] = useState(null);
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

  // console.log(currentMessage);

  useEffect(() => {
    const fetchMessageData = async () => {
      if (!currentMessage) {
        setIsEditing(true);
        return;
      }
      try {
        setMessage(currentMessage);
      } catch (error) {
        addAlert("Erreur de chargement des données adhérent.", "", "", "error");
      }
    };
    fetchMessageData();
  }, [currentMessage]);

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

    setMessage((prevMessage) => ({
      ...prevMessage,
      [name]: value,
    }));
  };

  const saveChanges = async () => {
    // if (!currentMessage) {
    if (!message?.message || !message?.recepteur) {
      addAlert("Veuillez remplir tous les champs.", "", "", "error");
      return;
    }
    // }

    setLoading(true);
    try {
      const MessageData = {
        expediteur: adminEmail,
        message: message.message,
        recepteur: message.recepteur,
        admin: true,
      };

      if (!currentMessage) {
        //Create
        const messageD = await sendAdminMessage(MessageData);
        // Met à jour la liste des clients dans MessagesPage
        updateMessages({
          ...MessageData,
          id: messageD?.id,
          isNew: true,
        });
        addAlert("Message ajoute avec réussie !", "", "", "success");
      }
    } catch (error) {
      addAlert("Échec de l'ajout. Réessayez.", "", "", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAction = async () => {
    setLoading(true);
    try {
      // Suppression du client via l'API
      await deleteMessage(message.id);
      updateMessages({ ...message, isNew: false });
      // Ajout d'un message de succès
      addAlert("Message supprimé avec succès.", "", "", "success");
      // Fermer la modale
      onClose();
    } catch (error) {
      addAlert("Erreur lors de la suppression du livre.", "", "", "error");
      console.error("Erreur lors de la suppression du livre", error);
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
          {!isEditing ? (
            <div className="profileInfo">
              <label>Sender :</label>
              <p>{message?.expediteur}</p>
            </div>
          ) : null}

          <div className="profileInfo">
            <label>Receiver :</label>
            {isEditing ? (
              <input
                type="text"
                name="recepteur"
                value={message?.recepteur}
                onChange={handleInputChange}
              />
            ) : (
              <p>{message?.recepteur}</p>
            )}
          </div>

          <div className="profileInfo">
            <label>Message :</label>
            {isEditing ? (
              <textarea
                rows={10}
                cols={20}
                placeholder="Your Message Here"
                type="text"
                name="message"
                value={message?.message}
                onChange={handleInputChange}
              />
            ) : (
              <p>{message?.message}</p>
            )}
          </div>

          <div className="profileActions">
            {loading ? (
              <button disabled>Chargement...</button>
            ) : isDelete ? (
              <button className="deleteBtn" onClick={() => deleteAction()}>
                Delete
              </button>
            ) : isEditing ? (
              <button onClick={() => saveChanges()}>Send</button>
            ) : (
              <button onClick={() => onClose()}>Close</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowMessage;
