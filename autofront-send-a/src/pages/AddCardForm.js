import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import api from "../utils/api"; // ton utilitaire axios configuré

const AddCardForm = ({ userId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleAddCard = async (e) => {
    e.preventDefault();
    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    const { token, error } = await stripe.createToken(cardElement);
    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // Envoie le token au backend pour enregistrer la carte
    await api.post(`/payment/user/add-card`, {
     userId,
      tokenId: token.id,
    });

    alert("Carte enregistrée !");
    setLoading(false);
  };

  return (
    <form onSubmit={handleAddCard}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading} className="btn btn-primary mt-3">
        Enregistrer la carte
      </button>
    </form>
  );
};

export default AddCardForm;
