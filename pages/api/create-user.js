const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function (req, res) {
  if (req.method === "POST") {
    const { name, email, description } = JSON.parse(req.body);

    console.log(req.body);

    const customer = await stripe.customers.create({
      name,
      email,
      description,
    });

    res.status(200).send(customer);
  }
}
