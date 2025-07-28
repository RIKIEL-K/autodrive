import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Simule une commande fictive pour l'affichage sans backend
    const mockOrder = {
      id,
      client: {
        name: "Jean Dupont",
        email: "jean.dupont@email.com",
        phone: "514-555-1234",
      },
      date: "2025-06-13 14:30",
      from: "1000 Rue de la Gauchetière O, Montréal",
      to: "3000 Chemin Queen Mary, Montréal",
      time: "15 min",
      distance: "8.5 km",
      price: 22.75,
      comment: "Merci pour votre ponctualité !",
    };

    setTimeout(() => {
      setOrder(mockOrder);
    }, 800); 
  }, [id]);

  if (!order) {
    return (
      <div className="container-fluid py-5" style={{ backgroundColor: "#f4f9ff", minHeight: "100vh" }}>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted">Chargement des détails de la commande...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container-fluid py-5" style={{ backgroundColor: "#f4f9ff", minHeight: "100vh" }}>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-header bg-primary text-white rounded-top-4 px-4 py-3 d-flex justify-content-between">
                <h5 className="mb-0">
                  <i className="fas fa-info-circle me-2"></i>Détails de la commande #{order.id}
                </h5>
                <button className="btn btn-sm btn-light text-primary" onClick={() => navigate(-1)}>
                  <i className="fas fa-arrow-left me-1"></i>Retour
                </button>
              </div>

              <div className="card-body px-4 py-4">
                <h6 className="mb-3 text-primary">Client</h6>
                <p><strong>Nom :</strong> {order.client.name}</p>
                <hr />

                <h6 className="mb-3 text-primary">Course</h6>
                <p><strong>Date :</strong> {order.date}</p>
                <p><strong>Départ :</strong> {order.from}</p>
                <p><strong>Destination :</strong> {order.to}</p>
                <p><strong>Temps :</strong> {order.time}</p>
                <p><strong>Distance :</strong> {order.distance}</p>
                <p><strong>Prix :</strong> {order.price.toFixed(2)} $</p>

                {order.comment && (
                  <>
                    <hr />
                    <h6 className="mb-2 text-primary">Commentaire client</h6>
                    <blockquote className="blockquote ps-3 border-start border-primary">
                      <p className="mb-0">{order.comment}</p>
                    </blockquote>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
