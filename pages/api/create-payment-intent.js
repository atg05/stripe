// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

export default async function handler(req, res) {
  const { email, items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "inr",

    automatic_payment_methods: {
      enabled: true,
    },
  });

  const customer = await stripe.customers.create({
    email,
    description:
      "My First Test Customer (created for API docs at https://www.stripe.com/docs/api)",
  });

  console.log(customer);

  stripe.paymentMethods
    .create({
      type: "card",
      card: {
        number: "4242424242424242",
        exp_month: 12,
        exp_year: 2025,
        cvc: "123",
      },
      billing_details: {
        name: "John Doe",
        email: "john.doe@example.com",
        address: {
          line1: "123 Main St",
          city: "Anytown",
          state: "CA",
          country: "US",
          postal_code: "12345",
        },
      },
      customer: customer.id,
    })
    .then(function (paymentMethod) {
      console.log(paymentMethod);
    })
    .catch(function (err) {
      console.log(err);
    });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
}
