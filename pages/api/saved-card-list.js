export default async function handler(req, res) {
  const { customerID } = req.query;
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  const customer = await stripe.customers.retrieve(customerID);

  // Retrieve the default payment method
  const defaultPaymentMethod = customer.invoice_settings.default_payment_method;

  const paymentMethods = await stripe.customers.listPaymentMethods(customerID, {
    type: "card",
  });

  const paymentMethods_default = paymentMethods.data?.map((payemnt) => {
    if (payemnt.id === defaultPaymentMethod) {
      return { ...payemnt, default: true };
    }
    return payemnt;
  });
  res.status(200).send({ data: paymentMethods_default });
}
