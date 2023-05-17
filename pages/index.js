import React, { useEffect, useState } from "react";
// import "../styles/Styles.css";
import PopUp from "./components/PopUp";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.

export default function App() {
  const appearance = {
    theme: "stripe",
    layout: "tabs",
  };

  const [clientSecret, setClientSecret] = useState(null);
  const [paymentLists, setPaymentLists] = useState(null);

  async function updateClientScret() {
    // Create PaymentIntent as soon as the page loads
    await fetch("/api/secret")
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.client_secret);
      });
  }

  const fetchPaymentList = async () => {
    await fetch(`/api/saved-card-list/?customerID=${"cus_NqKbkn5vgX48IX"}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res.data);
        setPaymentLists(res.data || []);
      });
  };

  const handlePopup = () => {
    setPopUp((state) => !state);
  };

  useEffect(() => {
    fetchPaymentList();
  }, []);

  const options = {
    clientSecret,
    appearance,
  };

  function updatePaymentList(payments) {
    setPaymentLists(payments);
  }

  const defaultCardStyle = {
    borderRadius: "100%",
    border: "2px solid red",
    padding: "2px",
    height: "10px",
    width: "10px",
    backgroundColor: "blue",
    margin: "1px",
    margingLeft: "auto",
  };
  const CardStyle = {
    borderRadius: "100%",
    border: "2px solid red",
    padding: "2px",
    height: "10px",
    width: "10px",
    margin: "1px",
    margingLeft: "auto",
  };

  const [popUp, setPopUp] = useState(false);

  return (
    <div className="App" style={{ margin: "auto", maxWidth: "500px" }}>
      {popUp && (
        <PopUp
          updatePaymentList={updatePaymentList}
          handlePopup={handlePopup}
        />
      )}

      <button
        onClick={() => {
          setPopUp((state) => !state);
        }}
      >
        Add
      </button>

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
                style={card.default ? defaultCardStyle : CardStyle}
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
              ></button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
