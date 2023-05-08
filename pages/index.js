import React, { useEffect, useState } from "react";
// import "../styles/Styles.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CardSetupForm from "./components/CardSetupForm";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.

// First Thing
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function App() {
  const appearance = {
    theme: "stripe",
    layout: "tabs",
  };

  const [clientSecret, setClientSecret] = useState(null);
  const [paymentLists, setPaymentLists] = useState(null);

  useEffect(async () => {
    // Create PaymentIntent as soon as the page loads
    await fetch("/api/secret")
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.client_secret);
      });

    await fetch(`/api/saved-card-list/?customerID=${"cus_NqKbkn5vgX48IX"}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res.data);
        setPaymentLists(res.data || []);
      });
  }, []);

  const options = {
    clientSecret,
    appearance,
  };

  function updatePaymentList(payments) {
    setPaymentLists(payments);
  }

  return (
    <div className="App" style={{ margin: "auto", maxWidth: "500px" }}>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CardSetupForm updatePaymentList={updatePaymentList} />
        </Elements>
      )}

      {/* <button
        onClick={async () => {
          await fetch(
            `/api/saved-card-list/?customerID=${"cus_NqKbkn5vgX48IX"}`
          )
            .then((res) => res.json())
            .then((res) => {
              console.log(res.data);
              setPaymentLists(res.data);
            });
        }}
      >
        Fetch Cards
      </button> */}

      {paymentLists?.map((card, index) => {
        return (
          <div
            style={{
              border: "1px solid gray",
              marginTop: "20px",
              padding: "5px",
              borderradius: "4px",
            }}
          >
            <input type="text" value={card.card.last4} />
            <div>
              <input style={{ width: "60px" }} value={card.card.exp_year} />
              <button
                disabled={card.default}
                onClick={async () => {
                  await fetch("/api/update-payment-method", {
                    method: "POST",
                    body: JSON.stringify({
                      customerID: "cus_NqKbkn5vgX48IX",
                      paymentMethodID: card.id,
                    }),
                  });

                  await fetch(
                    `/api/saved-card-list/?customerID=${"cus_NqKbkn5vgX48IX"}`
                  )
                    .then((res) => res.json())
                    .then((res) => {
                      console.log(res.data);
                      setPaymentLists(res.data || []);
                    });
                }}
              >
                {card.default ? "Default" : "Update Default Payment"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
