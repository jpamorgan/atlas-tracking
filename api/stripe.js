const amplitude = require("../_lib/amplitude");
const facebook = require("../_lib/facebook");
const stripe = require("../_lib/stripe");
const _get = require("lodash/get");

function mapToStandardEvent(type) {
  switch (type) {
    case "customer.subscription.created":
      return "Subscribe";
    case "invoice.payment_succeeded":
      return "Purchase";
    default:
      return `Stripe ${type}`;
  }
}

function getStandardEventProps(type, data) {
  switch (type) {
    case "Purchase":
      const cents = _get(data, "object.amount_paid");
      const value = cents ? cents / 100 : null;
      const currency = _get(data, "object.currency")
        ? _get(data, "object.currency").toUpperCase()
        : null;
      return {
        currency,
        value,
      };
    default:
      return {};
  }
}

module.exports = async (req, res) => {
  try {
    // if (req.headers.secret_key !== "fubar")
    //   throw new Error("Missing auth header");

    const { type, data } = req.body || {};

    if (!type || !data) throw new Error("Invalid event schema");

    const promises = [];

    let customerId, email;

    if (type === "customer.created") {
      customerId = _get(data, "object.id");
      email = _get(data, "object.email");
    } else if (type === "customer.subscription.created")
      customerId = _get(data, "object.customer");
    else if (type === "invoice.payment_failed")
      customerId = _get(data, "object.customer");
    else if (type === "invoice.payment_succeeded") {
      customerId = _get(data, "object.customer");
    } else console.log("Event type not supported");

    email = email || (await stripe.getCustomerEmail(customerId));

    if (email && customerId) {
      if (process.env.AMPLITUDE_API_KEY) {
        promises.push(
          amplitude.track(process.env.AMPLITUDE_API_KEY, `Stripe ${type}`, {
            email,
            anonymousId: customerId,
          })
        );
      } else console.log("Missing amplitude api key");

      if (process.env.FACEBOOK_PIXEL_ID && process.env.FACEBOOK_ACCESS_TOKEN) {
        promises.push(
          facebook.track(
            process.env.FACEBOOK_PIXEL_ID,
            process.env.FACEBOOK_ACCESS_TOKEN,
            mapToStandardEvent(type),
            {
              email,
              anonymousId: customerId,
            },
            {},
            getStandardEventProps(mapToStandardEvent(type), data)
          )
        );
      }
    } else {
      console.error("Missing email and/or customerId");
    }

    const results = await Promise.allSettled(promises);

    res.json({
      success: true,
      amp: process.env.AMPLITUDE_API_KEY ? true : "Missing amp api key",
      fb: process.env.FACEBOOK_ACCESS_TOKEN ? true : "Missing fb token",
      fbPixel: process.env.FACEBOOK_PIXEL_ID ? true : "Missing fb pixel",
      results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "There was an error processing this request",
      error: err,
    });
  }
};
