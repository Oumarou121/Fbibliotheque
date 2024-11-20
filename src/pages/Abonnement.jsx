import React, { useState } from "react";
import TopBody from "../components/TopBody";
import "../styles/Abonnement.css";
import { FaCheckCircle, FaTimesCircle, FaStar } from "react-icons/fa";

const plans = [
  {
    id: 1,
    name: "Basique",
    price: "Gratuit",
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
    features: ["Accès complet", "Emprunts illimités", "Support 24/7"],
    isPremium: true,
  },
];

function AbonnementContent() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSubscribe = (planId) => {
    setSelectedPlan(planId);
    alert(
      `Vous avez souscrit au plan : ${
        plans.find((plan) => plan.id === planId).name
      }`
    );
  };

  return (
    <div className="abonnement-container">
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
