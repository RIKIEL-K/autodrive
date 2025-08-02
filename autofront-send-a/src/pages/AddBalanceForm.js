import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import api from "../utils/api";

const AddBalanceForm = ({ userId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState("");

  const handleAddBalance = async (e) => {
    e.preventDefault();

    const cardElement = elements.getElement(CardElement);
    const { token, error } = await stripe.createToken(cardElement);

    if (error) {
      alert(error.message);
      return;
    }

    const res = await api.post("/payment/user/add-balance", {
      userId,
      tokenId: token.id,
      amount: parseFloat(amount),
    });

    alert("Solde ajouté avec succès !");
    setAmount("");
  };

  return (
    <form onSubmit={handleAddBalance}>
      <div className="mb-2">
        <label>Montant à ajouter ($)</label>
        <input
          type="number"
          className="form-control"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <CardElement className="mb-3" />
      <button className="btn btn-success" type="submit" disabled={!stripe}>
        Ajouter au solde
      </button>
    </form>
  );
};

export default AddBalanceForm;
