export default async function handler(req, res) {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  const paymentMethods = await stripe.customers.listPaymentMethods(
    "cus_NqKZvfgxpBK3kQ",
    { type: "card" }
  );
  res.status(200).send(paymentMethods);
}
