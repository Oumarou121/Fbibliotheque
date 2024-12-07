import React, { useState, useEffect } from "react";
import "../styles/Profil.css";
import { updateClient, getClientData, getAdherentByClient } from "../Api.js";
import Alert from "../components/Alert";

const UserProfile = () => {
  const [adherent, setAdherent] = useState();
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getClientData();
        setUserData(user);
        const adherentValue = await getAdherentByClient(user.id);
        const lastAdherent = adherentValue[adherentValue.length - 1];
        setAdherent(lastAdherent);
        const typeMapping = ["Basic", "Standard", "Premium"];
        setTypeAdherent(typeMapping[lastAdherent?.type] || "No subscription");
      } catch (error) {
        addAlert("Error loading user data.", "", "", "error");
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Retirer tous les caractères non numériques

    // Limiter la longueur à 8 chiffres après +216
    if (value.length > 8) {
      value = value.slice(0, 8);
    }

    // Mettre à jour le state avec +216 suivi des chiffres
    setUserData((prevUser) => ({
      ...prevUser,
      telephone: "+216" + value,
    }));
  };

  const formatPhoneNumber = (phone) => {
    // Enlever le préfixe +216 et formater
    const cleaned = phone.replace(/\D/g, "").slice(3); // Enlever +216 et tout caractère non numérique
    const formatted = cleaned.replace(/(\d{2})(?=\d)/g, "$1 ");
    return formatted;
  };

  const saveChanges = async () => {
    if (!userData.nom || !userData.adresse || !userData.telephone) {
      addAlert("All fields must be completed.", "", "", "warning");
      return;
    }
    setLoading(true);
    try {
      const clientData = {
        nom: userData.nom,
        adresse: userData.adresse,
        telephone: userData.telephone,
      };
      await updateClient(userData?.id, clientData);
      addAlert("Update successful!", "", "", "success");
      setIsEditing(false);
    } catch (error) {
      addAlert("Update failed. Please try again.", "", "", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profileContainer1">
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
      <h2>Mon Profil</h2>
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
          <p>{userData?.email}</p>
        </div>
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
          <label>address :</label>
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
          <label>Subscription type :</label>
          <p>{typeAdherent}</p>
        </div>
        <div className="profileInfo">
          <label>Remaining loans :</label>
          <p>{adherent?.nbrEmprunt}</p>
        </div>
        <div className="profileActions">
          {loading ? (
            <button disabled>Loading...</button>
          ) : isEditing ? (
            <button onClick={saveChanges}>To safeguard</button>
          ) : (
            <button onClick={() => setIsEditing(true)}>To modify</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
