import React, { useEffect, useState } from "react";
import "../styles/Customers.css";
import { getAllMessages, getClientData } from "../Api";
import ShowMessage from "../components/ShowMessage.jsx";

const MessagesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleMessageModal = (message = null, isDel = false) => {
    setCurrentMessage(message);
    setIsModalOpen(true);
    setIsDelete(isDel);
  };

  // const truncateMessage = (message, wordLimit = 2) => {
  //   const words = message.split(" ");
  //   if (words.length > wordLimit) {
  //     return words.slice(0, wordLimit).join(" ") + " ...";
  //   }
  //   return message;
  // };

  const truncateByLetters = (message, charLimit = 20) => {
    if (message.length > charLimit) {
      return message.slice(0, charLimit) + " ...";
    }
    return message;
  };

  useEffect(() => {
    const getMessages = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const user = await getClientData();
          setUserData(user);
          const messages = await getAllMessages();
          setMessages(messages);
          setFilteredMessages(messages);
        } catch (error) {
          console.error("Erreur lors de la récupération des livres", error);
          setMessages([]);
        }
      }
    };
    getMessages();
  }, []);

  // Filtrer les livres en fonction du texte saisi
  useEffect(() => {
    const results = messages.filter(
      (message) =>
        (message.expediteur &&
          message.expediteur
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (message.recepteur &&
          message.recepteur.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (message.id && message.id === searchTerm)
    );
    setFilteredMessages(results);
  }, [searchTerm, messages]);

  return (
    <>
      {/* Modale de confirmation d'emprunt */}
      {isModalOpen && (
        <ShowMessage
          adminEmail={userData?.email}
          isDelete={isDelete}
          currentMessage={currentMessage}
          onClose={() => setIsModalOpen(false)}
          updateMessages={(updatedMessage) => {
            if (isDelete) {
              // Supprimer un client
              setMessages((prevMessages) =>
                prevMessages.filter(
                  (message) => message.id !== updatedMessage.id
                )
              );
            } else {
              if (!updatedMessage.isNew) {
                // Met à jour un client existant
                setMessages((prevMessages) =>
                  prevMessages.map((message) =>
                    message.id === updatedMessage.id ? updatedMessage : message
                  )
                );
              } else {
                // Ajoute un nouveau client avec un ID généré
                setMessages((prevMessages) => [
                  ...prevMessages,
                  updatedMessage,
                ]);
              }
            }
          }}
        />
      )}

      <div className="admin-dashboard">
        <h1>Manage Messages</h1>

        <div className="product-actions">
          <input
            type="text"
            id="search"
            placeholder="Search message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => handleMessageModal()}>Add New Message</button>
        </div>

        <table id="productTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Sender</th>
              <th>Message</th>
              <th>Receiver</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMessages.map((message) => {
              return (
                <tr key={message.id}>
                  <td>{message.id}</td>
                  <td>{message.admin ? "Admin" : message.expediteur}</td>
                  <td>{truncateByLetters(message.message)}</td>
                  <td>{message.admin ? message.recepteur : "Admin"}</td>
                  <td className="table-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleMessageModal(message, false)}
                    >
                      Détails
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleMessageModal(message, true)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MessagesPage;
