import React, { useState, useEffect } from "react";
import "../styles/MessageClient.css";
import { getClientData, getMessagesByReceiver } from "../Api";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClientData = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const data = await getClientData();
          const messagesByReceiver = await getMessagesByReceiver(data?.email);
          setMessages(messagesByReceiver);
        } catch (error) {
          setError("Erreur lors de la récupération des messages.");
        } finally {
          setLoading(false);
        }
      } else {
        setError("Utilisateur non authentifié.");
        setLoading(false);
      }
    };
    fetchClientData();
  }, []);

  // Gestion des états : Chargement, Erreur, ou Affichage des messages
  if (loading) {
    return <p className="loading-message">Chargement des messages...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="messages-container">
      <h1 className="messages-title">Messages Réçus</h1>
      {messages.length === 0 ? (
        <p>Aucun message reçu.</p>
      ) : (
        <ul className="messages-list">
          {messages.map((msg) => (
            <li key={msg.id} className="message-item">
              <p className="message-content">{msg.message}</p>
              <span className="message-timestamp">{msg.timestamp}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Messages;
