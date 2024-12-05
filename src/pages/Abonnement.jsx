import React, { useState, useEffect } from "react";
import TopBody from "../components/TopBody";
import "../styles/Abonnement.css";
import { FaCheckCircle } from "react-icons/fa";
import { getAdherentByClient, getClientData, addAdherent } from "../Api";
import Alert from "../components/Alert";

const plans = [
  {
    id: 1,
    name: "Basique",
    price: "10DNT/mois",
    features: ["Accès limité", "5 emprunts/mois", "Pas de support premium"],
    isPremium: false,
  },
  {
    id: 2,
    name: "Standard",
    price: "25DNT/mois",
    features: ["Accès complet", "15 emprunts/mois", "Support par email"],
    isPremium: false,
  },
  {
    id: 3,
    name: "Premium",
    price: "50DNT/mois",
    features: ["Accès complet", "35 emprunts/mois", "Support 24/7"],
    isPremium: true,
  },
];

function AbonnementContent() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [adherent, setAdherent] = useState([]);
  const [userData, setUserData] = useState(null);
  const [alerts, setAlerts] = useState([]); // Gestion des alertes

  // Ajouter une alerte
  const addAlert = (message, link, linkText, type) => {
    setAlerts((prevAlerts) => [
      ...prevAlerts,
      { message, link, linkText, type, id: Date.now() },
    ]);
  };

  // Supprimer une alerte
  const removeAlert = (id) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  const handleSubscribe = async (planId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Utilisateur non authentifié.");
      alert("Vous devez être connecté pour vous abonner.");
      addAlert(
        "Vous devez être connecté pour vous abonner.",
        "",
        "",
        "warning"
      );
      return;
    }

    if (adherent.length > 0 && adherent[adherent.length - 1].nbrEmprunt > 0) {
      console.log(
        "Utilisateur déjà abonné, type actuel :",
        adherent[adherent.length - 1].type
      );
      addAlert("Utilisateur déjà abonné", "", "", "warning");
      return;
    }

    // Ajouter un nouvel abonnement
    try {
      await addAdherent({ clientId: userData?.id, type: planId });
      console.log("Abonnement ajouté pour le client :", userData?.id);
      setSelectedPlan(planId);
      addAlert(
        `Abonnement ajouté pour le client : " ${userData?.nom}`,
        "",
        "",
        "success"
      );
    } catch (error) {
      console.error("Erreur lors de l'abonnement :", error);
      addAlert(error.toString(), "", "", "warning");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const user = await getClientData();
          setUserData(user);

          const adherentValue = await getAdherentByClient(user.id);
          setAdherent(adherentValue);
          console.log(adherent);

          if (
            adherentValue.length > 0 &&
            adherentValue[adherentValue.length - 1].nbrEmprunt > 0
          ) {
            const lastAdherent = adherentValue[adherentValue.length - 1];
            setSelectedPlan(lastAdherent.type);
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des données utilisateur :",
            error
          );
        }
      } else {
        console.error("Utilisateur non authentifié.");
      }
    };

    fetchUserData();
  }, [adherent]);

  return (
    <div className="abonnement-container">
      {/* Affichage des alertes */}
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
      <h1 className="fs-300 fs-poppins text-red">
        Choisissez votre plan d'abonnement
      </h1>
      <div className="plans-container">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`plan-card ${plan.isPremium ? "premium" : ""}`}
          >
            <h2 className="fs-200">{plan.name}</h2>
            <p className="price">{plan.price}</p>
            <ul className="features">
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <FaCheckCircle className="icon-check" /> {feature}
                </li>
              ))}
            </ul>
            <button
              className={`btn-subscribe ${
                selectedPlan === plan.id ? "subscribed" : ""
              }`}
              onClick={() => handleSubscribe(plan.id)}
            >
              {selectedPlan === plan.id ? "Souscrit" : "Souscrire"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Abonnement() {
  return (
    <>
      <TopBody visibility="true" name="Abonnement" />
      <AbonnementContent />
    </>
  );
}

export default Abonnement;
