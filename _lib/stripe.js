const _get = require("lodash/get");

const request = require("./request");

function getCustomerMeta(id) {
  return request
    .get(`https://api.stripe.com/v1/customers/${id}`, {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
    })
    .then((res) => {
      return {
        email: _get(res, "email"),
        workspaceId: _get(res, "metadata.workspaceId")
      }
    });
}

module.exports = {
  getCustomerMeta,
};
