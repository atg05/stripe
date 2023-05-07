export default async function handler(req, res) {
  if (req.method === "GET") {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

    const intent = await stripe.setupIntents.create({
      customer: "cus_NqKbkn5vgX48IX",
    });

    res.status(200).send({ client_secret: intent.client_secret });
  }
}
