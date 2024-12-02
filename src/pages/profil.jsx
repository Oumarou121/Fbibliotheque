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
        const typeMapping = ["Basique", "Standard", "Premium"];
        setTypeAdherent(typeMapping[lastAdherent?.type] || "Inconnu");
      } catch (error) {
        addAlert(
          "Erreur de chargement des données utilisateur.",
          "",
          "",
          "error"
        );
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
      addAlert("Tous les champs doivent être remplis.", "", "", "warning");
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
      addAlert("Mise à jour réussie !", "", "", "success");
      setIsEditing(false);
    } catch (error) {
      addAlert("Échec de la mise à jour. Réessayez.", "", "", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profileContainer">
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
          <label>Nom :</label>
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
          <label>Téléphone :</label>
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
          <label>Adresse :</label>
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
          <label>Type d'abonnement :</label>
          <p>{typeAdherent}</p>
        </div>
        <div className="profileInfo">
          <label>Emprunts restants :</label>
          <p>{adherent?.nbrEmprunt}</p>
        </div>
        <div className="profileActions">
          {loading ? (
            <button disabled>Chargement...</button>
          ) : isEditing ? (
            <button onClick={saveChanges}>Sauvegarder</button>
          ) : (
            <button onClick={() => setIsEditing(true)}>Modifier</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
