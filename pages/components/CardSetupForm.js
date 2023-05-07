import React, { useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

import CardSection from "./cardSection/CardSection";

export default function CardSetupForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(async () => {
    // Create PaymentIntent as soon as the page loads
    await fetch("/api/secret")
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.client_secret);
      });
  }, []);

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    console.log(clientSecret);

    const result = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: "Jenny Rosen",
        },
      },
    });

    console.log(result);

    if (result.error) {
      // Display result.error.message in your UI.
    } else {
      fetch("/api/new-card", {
        method: "POST",
        body: JSON.stringify({
          payment_method: result.setupIntent.payment_method,
        }),
      });
      // The setup has succeeded. Display a success message and send
      // result.setupIntent.payment_method to your server to save the
      // card to a Customer
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardSection />
      <button disabled={!stripe}>Save Card</button>
    </form>
  );
}
