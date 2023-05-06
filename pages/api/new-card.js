const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function (req, res) {
  if (req.method === "POST") {
    const { customerId, source } = JSON.parse(req.body);
    console.log(customerId);
    const card = await stripe.customers.createSource("cus_NqKZvfgxpBK3kQ", {
      source: "tok_mastercard",
    });

    res.send(card);
  }
}
