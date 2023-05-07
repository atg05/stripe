import React, { useState } from "react";
// import "../styles/Styles.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./components/CheckoutForm";
import CardSetupForm from "./components/CardSetupForm";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function App() {
  const appearance = {
    theme: "stripe",
  };
  const options = {
    appearance,
  };

  const [userDetails, setUserDetails] = useState(null);
  const [paymentLists, setPaymentLists] = useState(null);

  console.log(paymentLists);

  return (
    <div className="App" style={{ margin: "auto", maxWidth: "500px" }}>
      {/* <button
        onClick={async () => {
          fetch("/api/create-user", {
            method: "POST",
            body: JSON.stringify({
              name: "Avinash Kumar",
              email: "aviansh@gmail.com",
              description: "Just a customer",
            }),
          }).then((res) => {
            setUserDetails(res);
            console.log(res);
          });
        }}
      >
        New user
      </button>
      <button
        style={{ display: "block" }}
        onClick={async () => {
          fetch("/api/new-card", {
            method: "POST",
            body: JSON.stringify({
              // customerId: userDetails.id,
              source: "tok_mastercard",
            }),
          })
            .then((res) => {
              setUserDetails(res);
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        }}
      >
        New Card
      </button> */}

      <Elements options={options} stripe={stripePromise}>
        <CardSetupForm />
      </Elements>

      {/* <button
        onClick={async () => {
          // ! Ye API hai jissee tum user ka card details fetch kar skit ho
          // ^ user ne kon sa default payment set kiya hai wo dekh skti ho
          const response = await fetch(`/api/saved-card-list`)
            .then((res) => res.json())
            .then((res) => {
              setPaymentLists(res.data);
            });
          // const jsonData = response.json();
          // console.log(jsonData);

          // setPaymentLists(jsonData);
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
            </div>
          </div>
        );
      })}
    </div>
  );
}
