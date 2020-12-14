// Docs: https://help.amplitude.com/hc/en-us/articles/360032842391-HTTP-API-V2
const uuid = require("./uuid");
const _get = require("lodash/get");
const request = require("./request");
var crypto = require("crypto");

function hash(text) {
  const hash = crypto.createHash("sha256").update(text).digest("hex");
  return hash;
}

function mapUserData(traits, context) {
  const obj = {
    client_ip_address: context.ip,
    client_user_agent: context.userAgent,
    external_id:
      (context.userId && hash(context.userId)) ||
      (context.anonymousId && hash(context.anonymousId)),
    em: context.email && hash(context.email),
    fn: traits.firstName && hash(traits.firstName),
    ln: traits.lastName && hash(traits.lastName),
    ph: traits.phone && hash(traits.phone),
    ct: traits.city && hash(traits.city),
    st: traits.state && hash(traits.state),
    country: traits.country && hash(traits.country),
  };

  return obj;
}

function track(
  pixelId,
  accessToken,
  eventName,
  context,
  traits = {},
  props = {}
) {
  console.log("facebook.track:", eventName);
  return request.post(
    `https://graph.facebook.com/v9.0/${pixelId}/events?access_token=${accessToken}`,
    {
      test_event_code: "TEST9350",
      data: [
        {
          event_name: eventName,
          event_time: Math.round(Date.now() / 1000),
          event_source_url: context.url,
          event_id: uuid.raw(),
          user_data: mapUserData(traits, context),
          custom_data: props,
        },
      ],
    },
    {
      "Content-type": "application/json",
    }
  );
}

module.exports = {
  track,
};
