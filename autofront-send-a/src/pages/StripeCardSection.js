import React from "react";
import { useParams } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import AddCardForm from "./AddCardForm";


const stripePromise = loadStripe("pk_test_51RrWv01ImZ7JQ2To6cgeuXI38GLJHWpOBLvDS5TTtyXIcwxq25Ef1BTZeRcwWIFtDnLYTFsyuwgKDbkxLjPKbQTg00BPdT8O3u");

const StripeCardSection = () => {
  const { id } = useParams();

  return (
    <Elements stripe={stripePromise}>
      <AddCardForm userId={id} />
    </Elements>
  );
};

export default StripeCardSection;
