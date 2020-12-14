const _get = require("lodash/get");

const request = require("./request");

function getCustomerEmail(id) {
  return request
    .get(`https://api.stripe.com/v1/customers/${id}`, {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
    })
    .then((res) => _get(res, "email"));
}

module.exports = {
  getCustomerEmail,
};
