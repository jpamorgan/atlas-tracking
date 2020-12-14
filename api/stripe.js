const amplitude = require("../_lib/amplitude");
const facebook = require("../_lib/facebook");
const stripe = require("../_lib/stripe");
const _get = require("lodash/get");

module.exports = async (req, res) => {
  try {
    // if (req.headers.secret_key !== "fubar")
    //   throw new Error("Missing auth header");

    const { type, data } = req.body || {};

    if (!type || !data) throw new Error("Invalid event schema");

    const promises = [];
    let customerId;

    switch (type) {
      case "customer.created":
        customerId = _get(data, "object.id");
      case "customer.subscription.created":
        customerId = _get(data, "object.customer");
      case "invoice.payment_failed":
        customerId = _get(data, "object.customer");
      case "invoice.payment_succeeded":
        customerId = _get(data, "object.customer");
      default:
        const email = await stripe.getCustomerEmail(customerId);
        if (process.env.AMPLITUDE_API_KEY) {
          promises.push(
            amplitude.track(process.env.AMPLITUDE_API_KEY, `Stripe ${type}`, {
              email,
            })
          );
        } else console.log("Missing amplitude api key");

        if (
          process.env.FACEBOOK_PIXEL_ID &&
          process.env.FACEBOOK_ACCESS_TOKEN
        ) {
          promises.push(
            facebook.track(
              process.env.FACEBOOK_PIXEL_ID,
              process.env.FACEBOOK_ACCESS_TOKEN,
              `Stripe ${type}`,
              {
                email,
              }
            )
          );
        }
    }
    const promises = [];

    const results = await Promise.allSettled(promises);

    res.json({
      success: true,
      amp: process.env.AMPLITUDE_API_KEY ? true : "Missing amp api key",
      fb: process.env.FACEBOOK_ACCESS_TOKEN ? true : "Missing fb token",
      fbPixel: process.env.FACEBOOK_PIXEL_ID ? true : "Missing fb pixel",
      results,
    });
  } catch (err) {
    res.status(404).json({
      message: err.message || "There was an error processing this request",
    });
  }
};
