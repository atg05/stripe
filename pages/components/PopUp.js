import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CardSetupForm from "./CardSetupForm";
// First Thing
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const PopUp = ({ updatePaymentList, handlePopup }) => {
  const [clientSecret, setClientSecret] = useState(null);

  const appearance = {
    theme: "stripe",
    layout: "tabs",
  };

  const options = {
    clientSecret,
    appearance,
  };

  const updateClinetScret = async () => {
    await fetch("/api/secret")
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.client_secret);
      });
  };
  useEffect(() => {
    updateClinetScret();
  }, []);
  return (
    clientSecret && (
      <Elements options={options} stripe={stripePromise}>
        <CardSetupForm
          updatePaymentList={updatePaymentList}
          handlePopup={handlePopup}
        />
      </Elements>
    )
  );
};

export default PopUp;
