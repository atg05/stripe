const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function (req, res) {
  if (req.method === "POST") {
    const { customerId, source, payment_method } = JSON.parse(req.body);
    console.log(customerId);
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
    });

    res.send(setupIntent);
  }
}
