import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import api from "../utils/api";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import AddCardFormDriver from "./AddCardFormDriver";

const stripePromise = loadStripe("pk_test_51RrWv01ImZ7JQ2To6cgeuXI38GLJHWpOBLvDS5TTtyXIcwxq25Ef1BTZeRcwWIFtDnLYTFsyuwgKDbkxLjPKbQTg00BPdT8O3u"); // Remplace par ta clé publique Stripe

const DriverFinanceLayout = () => {
  const { id } = useParams(); // driverId depuis l'URL
  const [solde, setSolde] = useState(0);

  const fetchSolde = async () => {
    try {
      const res = await api.get(`/payment/driver/${id}/solde`);
      setSolde(res.data.solde);
    } catch (error) {
      console.error("Erreur récupération solde du chauffeur :", error);
    }
  };

  useEffect(() => {
    fetchSolde();
  }, [id]);

  return (
    <div>
      <Navbar />
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            <div className="card p-4 shadow-sm bg-light rounded-4">
              <h4 className="text-primary mb-3">Votre solde actuel</h4>
              <h2>${solde.toFixed(2)}</h2>
              <p className="text-muted mt-2">Ce solde représente les gains reçus sur votre compte Stripe.</p>
            </div>

            {/* Section ajout de carte pour le chauffeur */}
            <div className="card p-4 shadow-sm bg-white rounded-4 mt-4">
              <h5 className="text-primary mb-3">Ajouter une carte bancaire</h5>
              <Elements stripe={stripePromise}>
                <AddCardFormDriver driverId={id} />
              </Elements>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverFinanceLayout;
