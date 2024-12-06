import React, { useState, useEffect, useRef } from "react";
import "../styles/Modal.css";
import "../styles/Profil.css";
import {
  updateClient,
  getAdherentByClient,
  updateAdherent,
  addAdherent,
  createClient,
  deleteClient,
} from "../Api.js";
import Alert from "../components/Alert";

function ShowCustomer({ client, onClose, updateCustomers, isDelete }) {
  const modalRef = useRef(null); // Référence à la modale
  const [adherent, setAdherent] = useState([]);
  const [userData, setUserData] = useState(null);
  const [typeAdherent, setTypeAdherent] = useState("");
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

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchUserData = async () => {
      if (!client) {
        setIsEditing(true);
        return;
      }
      try {
        setUserData(client);
        const adherentValue = await getAdherentByClient(client.id);
        //console.log(adherentValue);
        if (adherentValue && adherentValue.length > 0) {
          const lastAdherent = adherentValue[adherentValue.length - 1];
          setAdherent(lastAdherent);
          setTypeAdherent(
            ["Basic", "Standard", "Premium"][lastAdherent.type - 1] ||
              "No subscription"
          );
        } else {
          setTypeAdherent("No subscription");
        }
      } catch (error) {
        addAlert("Error loading member data.", "", "", "error");
      }
    };
    fetchUserData();
  }, [client]);

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

    if (["type", "nbrEmprunt"].includes(name)) {
      setAdherent((prevAdherent) => ({
        ...prevAdherent,
        [name]:
          name === "type" || name === "nbrEmprunt" ? Number(value) : value, // Conversion explicite en nombre
      }));
    } else {
      setUserData((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Retirer tous les caractères non numériques

    if (value.length > 8) {
      value = value.slice(0, 8);
    }

    setUserData((prevUser) => ({
      ...prevUser,
      telephone: "+216" + value,
    }));
  };

  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, "").slice(3);
    const formatted = cleaned.replace(/(\d{2})(?=\d)/g, "$1 ");
    return formatted;
  };

  const deleteUser = async () => {
    setLoading(true);
    try {
      // Suppression du client via l'API
      await deleteClient(client.id);

      updateCustomers({ id: client.id, ...userData, isNew: false });

      // Ajout d'un message de succès
      addAlert("Client deleted successfully.", "", "", "success");

      // Fermer la modale
      onClose();
    } catch (error) {
      addAlert("Error deleting client.", "", "", "error");
    } finally {
      setLoading(false);
    }
  };

  const saveChanges = async () => {
    setLoading(true);
    try {
      const clientData = {
        nom: userData.nom,
        email: userData.email,
        role: userData.role,
        adresse: userData.adresse,
        telephone: userData.telephone,
      };

      const clientData1 = {
        nom: userData.nom,
        email: userData.email,
        password: userData.password,
        role: userData.role === "admin" ? "admin" : "client",
        adresse: userData.adresse,
        telephone: userData.telephone,
      };

      const adherentData = {
        id: adherent?.id,
        clientId: userData?.id,
        type: adherent?.type,
        nbrEmprunt: adherent?.nbrEmprunt,
      };

      if (!client) {
        const clientId = await createClient(clientData1);
        await delay(200);
        if (adherent?.type !== undefined) {
          await addAdherent({
            clientId: clientId,
            type: adherent?.type,
            nbrEmprunt: adherent?.nbrEmprunt || 0,
          });

          if (adherent?.nbrEmprunt === undefined || adherent?.nbrEmprunt < 0) {
            if (adherent?.type === 1) {
              setAdherent((prevAdherent) => ({
                ...prevAdherent,
                nbrEmprunt: 5,
              }));
            }

            if (adherent?.type === 2) {
              setAdherent((prevAdherent) => ({
                ...prevAdherent,
                nbrEmprunt: 15,
              }));
            }

            if (adherent?.type === 3) {
              setAdherent((prevAdherent) => ({
                ...prevAdherent,
                nbrEmprunt: 35,
              }));
            }
          }

          addAlert("Client added successfully!", "", "", "success");

          // Met à jour la liste des clients dans CustomersPage
          updateCustomers({ ...clientData1, id: clientId, isNew: true });
        }
      } else {
        await updateClient(userData?.id, clientData);

        if (adherent?.id) {
          await updateAdherent(adherentData);
        } else if (
          typeAdherent === "No subscription" &&
          adherent?.type !== undefined
        ) {
          await addAdherent({
            clientId: userData?.id,
            type: adherent?.type,
            nbrEmprunt: adherent?.nbrEmprunt || 0,
          });
        }

        // Met à jour la liste des clients dans CustomersPage
        updateCustomers({ ...clientData, id: userData?.id, isNew: false });
        addAlert("Update successful!", "", "", "success");
      }

      setTypeAdherent(
        ["Basic", "Standard", "Premium"][adherent?.type - 1] ||
          "No subscription"
      );
      setIsEditing(false);
      // onClose();
    } catch (error) {
      addAlert("Update failed. Please try again.", "", "", "error");
      //console.log(error);
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
        {/* <h2>x</h2> */}
        <div className="profileCard">
          <div className="profileInfo">
            <label>Name :</label>
            {isEditing ? (
              <input
                type="text"
                name="nom"
                value={userData?.nom}
                onChange={handleInputChange}
              />
            ) : (
              <p>{userData?.nom}</p>
            )}
          </div>
          <div className="profileInfo">
            <label>Email :</label>
            {isEditing ? (
              <input
                type="eamil"
                name="email"
                value={userData?.email}
                onChange={handleInputChange}
              />
            ) : (
              <p>{userData?.email}</p>
            )}
          </div>
          {!client && (
            <div className="profileInfo">
              <label>Password :</label>
              {isEditing ? (
                <input
                  type="text"
                  name="password"
                  value={userData?.password}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{userData?.password}</p>
              )}
            </div>
          )}
          <div className="profileInfo">
            <label>Phone :</label>
            {isEditing ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "5px" }}>+216</span>
                <input
                  type="text"
                  name="telephone"
                  value={userData?.telephone?.slice(4) || ""} // Affiche les chiffres sans le préfixe
                  onChange={handlePhoneChange}
                  maxLength="8" // Limite le champ à 8 chiffres après le préfixe
                />
              </div>
            ) : (
              <p>{"+216 " + formatPhoneNumber(userData?.telephone || "")}</p> // Affiche avec +216 et formaté
            )}
          </div>

          <div className="profileInfo">
            <label>Address :</label>
            {isEditing ? (
              <input
                type="text"
                name="adresse"
                value={userData?.adresse}
                onChange={handleInputChange}
              />
            ) : (
              <p>{userData?.adresse}</p>
            )}
          </div>
          <div className="profileInfo">
            <label>Role :</label>
            {isEditing ? (
              <input
                type="text"
                name="role"
                value={userData?.role}
                onChange={handleInputChange}
              />
            ) : (
              <p>{userData?.role}</p>
            )}
          </div>
          {/* {client && ( */}
          <div className="profileInfo">
            <label>Subscription type :</label>
            {isEditing ? (
              <input
                type="number"
                name="type" // Doit correspondre à la clé dans adherent
                value={adherent?.type || ""}
                onChange={handleInputChange}
              />
            ) : (
              <p>{typeAdherent}</p>
            )}
          </div>
          {/* )} */}
          {/* {client && ( */}
          <div className="profileInfo">
            <label>Remaining loans :</label>
            {isEditing ? (
              <input
                type="number"
                name="nbrEmprunt" // Doit correspondre à la clé dans adherent
                value={adherent?.nbrEmprunt || ""}
                onChange={handleInputChange}
              />
            ) : (
              <p>{adherent?.nbrEmprunt}</p>
            )}
          </div>
          {/* )} */}

          <div className="profileActions">
            {loading ? (
              <button disabled>Loading...</button>
            ) : isDelete ? (
              <button className="delete-btn" onClick={() => deleteUser()}>
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

export default ShowCustomer;
