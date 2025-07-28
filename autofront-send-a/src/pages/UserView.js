// CommandeSummaryPage.js
import React from "react";
import { useNavigate } from "react-router-dom";

const CommandeSummaryPage = () => {
  const navigate = useNavigate();

  const conducteur = {
    nom: "Marc Tremblay",
    voiture: "Tesla Model 3 - Bleue",
    tel: "514-123-4567",
    prix: 27.5,
    from: "123 Rue Principale",
    to: "456 Avenue Laval",
    distance: "5.2 km",
    temps: "18 min",
  };

  const handleValidation = () => {
    navigate("/chat-course", { state: { conducteur } });
  };

  return (
    <div className="container py-5" style={{ backgroundColor: "#f4f9ff", minHeight: "100vh" }}>
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-header bg-primary text-white rounded-top-4 px-4 py-3">
          <h5 className="mb-0"><i className="fas fa-check-circle me-2"></i>Validation de la commande</h5>
        </div>
        <div className="card-body px-4 py-4">
          <h6 className="text-primary">Détails du conducteur</h6>
          <p><strong>Nom :</strong> {conducteur.nom}</p>
          <p><strong>Véhicule :</strong> {conducteur.voiture}</p>
          <p><strong>Téléphone :</strong> {conducteur.tel}</p>
          <hr />
          <h6 className="text-primary">Informations de la course</h6>
          <p><strong>Départ :</strong> {conducteur.from}</p>
          <p><strong>Destination :</strong> {conducteur.to}</p>
          <p><strong>Temps :</strong> {conducteur.temps}</p>
          <p><strong>Distance :</strong> {conducteur.distance}</p>
          <p><strong>Prix :</strong> {conducteur.prix.toFixed(2)} $</p>

          <div className="text-end mt-4">
            <button className="btn btn-success" onClick={handleValidation}>
              Valider et démarrer la course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandeSummaryPage;
