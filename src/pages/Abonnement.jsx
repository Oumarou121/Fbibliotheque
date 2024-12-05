import React, { useState, useEffect } from "react";
import TopBody from "../components/TopBody";
import "../styles/Abonnement.css";
import { FaCheckCircle } from "react-icons/fa";
import { getAdherentByClient, getClientData, addAdherent } from "../Api";
import Alert from "../components/Alert";

const plans = [
  {
    id: 1,
    name: "Basic",
    price: "10DNT/mois",
    features: ["Limited access", "5 loans/month", "No premium support"],
    isPremium: false,
  },
  {
    id: 2,
    name: "Standard",
    price: "25DNT/mois",
    features: ["Full access", "15 loans/month", "Email support"],
    isPremium: false,
  },
  {
    id: 3,
    name: "Premium",
    price: "50DNT/mois",
    features: ["Full access", "35 loans/month", "24/7 support"],
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
      //console.error("Unauthenticated user.");
      addAlert(
        "You must be logged in to subscribe.",
        "",
        "",
        "warning"
      );
      return;
    }

    if (adherent.length > 0 && adherent[adherent.length - 1].nbrEmprunt > 0) {
      //console.log(
      //  "Utilisateur déjà abonné, type actuel :",
      //  adherent[adherent.length - 1].type
      //);
      addAlert("User already subscribed", "", "", "warning");
      return;
    }

    // Ajouter un nouvel abonnement
    try {
      await addAdherent({ clientId: userData?.id, type: planId });
      //console.log("Abonnement ajouté pour le client :", userData?.id);
      setSelectedPlan(planId);
      addAlert(
        `Subscription added for customer : " ${userData?.nom}`,
        "",
        "",
        "success"
      );
    } catch (error) {
      //console.error("Erreur lors de l'abonnement :", error);
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
          //console.log(adherent);

          if (
            adherentValue.length > 0 &&
            adherentValue[adherentValue.length - 1].nbrEmprunt > 0
          ) {
            const lastAdherent = adherentValue[adherentValue.length - 1];
            setSelectedPlan(lastAdherent.type);
          }
        } catch (error) {
          //console.error(
          //  "Error retrieving user data:",
          //  error
          //);
        }
      } else {
        //console.error("Unauthenticated user.");
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
        Choose your subscription plan
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
              {selectedPlan === plan.id ? "Subscribed" : "Subscribe"}
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
      <TopBody visibility="true" name="Subscription" />
      <AbonnementContent />
    </>
  );
}

export default Abonnement;
