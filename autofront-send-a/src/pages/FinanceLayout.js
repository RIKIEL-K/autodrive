import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import StripeCardSection from "./StripeCardSection";
import AddBalanceForm from "./AddBalanceForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import api from "../utils/api";

const stripePromise = loadStripe("pk_test_51RrWv01ImZ7JQ2To6cgeuXI38GLJHWpOBLvDS5TTtyXIcwxq25Ef1BTZeRcwWIFtDnLYTFsyuwgKDbkxLjPKbQTg00BPdT8O3u"); // remplace par ta clé publique Stripe

const FinanceLayout = () => {
  const { id } = useParams();
  const [solde, setSolde] = useState(0);

  const fetchSolde = async () => {
    try {
      const res = await api.get(`/payment/user/${id}/solde`);
      setSolde(res.data.solde);
    } catch (error) {
      console.error("Erreur récupération du solde :", error);
    }
  };

  useEffect(() => {
    fetchSolde();
  }, [id]);

  return (
    <div>
      <Navbar />
      <div className="container-fluid py-4" style={{ backgroundColor: "#f4f9ff" }}>
        <div className="row">
          <div className="col-lg-8">
            <div className="row g-4">

              {/* Solde utilisateur */}
              <div className="col-12">
                <div className="card p-3 shadow-sm bg-light rounded-4">
                  <h5 className="text-dark">Solde actuel : ${solde.toFixed(2)}</h5>
                </div>
              </div>

              {/* Ajout de carte */}
              <div className="col-12">
                <div className="card p-3 shadow-sm">
                  <h6 className="text-primary mb-2">Ajouter une carte</h6>
                  <StripeCardSection userId={id} />
                </div>
              </div>

              {/* Ajout de solde */}
              <div className="col-12">
                <div className="card p-3 shadow-sm">
                  <h6 className="text-primary mb-2">Ajouter de l'argent à votre solde</h6>
                  <Elements stripe={stripePromise}>
                    <AddBalanceForm userId={id} onBalanceAdded={fetchSolde} />
                  </Elements>
                </div>
              </div>

            </div>
          </div>

          {/* Zone droite vide (anciennement invoices) */}
          <div className="col-lg-4">
            <div className="card h-100 shadow-sm rounded-4">
              <div className="card-body d-flex align-items-center justify-content-center">
                <p className="text-muted">Aucune information supplémentaire</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceLayout;
