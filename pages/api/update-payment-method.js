export default async function handler(req, res) {
  if (req.method === "POST") {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

    const { customerID, paymentMethodID } = JSON.parse(req.body);

    await stripe.customers.update(customerID, {
      invoice_settings: {
        default_payment_method: paymentMethodID,
      },
    });
  }

  res.status(200).send("Payment Method Updated");
}
