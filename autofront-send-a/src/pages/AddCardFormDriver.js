import React, { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import api from "../utils/api";

const AddCardFormDriver = ({ driverId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    const { token, error } = await stripe.createToken(cardElement);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    try {
      await api.post("/payment/driver/add-card", {
        driverId,
        tokenId: token.id,
      });
      alert("Carte enregistrée pour le chauffeur !");
    } catch (err) {
      alert("carte déjà enregistrée");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement className="form-control mb-3" />
      <button
        type="submit"
        className="btn btn-primary"
        disabled={!stripe || loading}
      >
        {loading ? "Enregistrement..." : "Enregistrer la carte"}
      </button>
    </form>
  );
};

export default AddCardFormDriver;
