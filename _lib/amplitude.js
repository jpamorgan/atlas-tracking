// Docs: https://help.amplitude.com/hc/en-us/articles/360032842391-HTTP-API-V2
const uuid = require("./uuid");
const _get = require("lodash/get");
const request = require("./request");
const urlTools = require("./urlTools");

function track(apiKey, eventName, context = {}, traits = {}, props = {}) {
  console.log("amplitude.track:", eventName);
  return request.post(
    "https://api.amplitude.com/2/httpapi",
    {
      api_key: apiKey,
      events: [
        {
          user_id: context.userId,
          device_id: context.anonymousId,
          event_type: eventName,
          time: new Date().getTime(),
          event_properties: {
            ...props,
            ...urlTools.getParts(context.url),
            url: context.url,
          },
          user_properties: traits,
          os_name: _get(context, "ua.os.name"),
          os_version: _get(context, "ua.os.version"),
          price: props.price,
          quantity: props.quantity,
          revenue:
            props.price && props.quantity
              ? Number(props.quantity) * Number(props.price)
              : null,
          ip: context.ip,
          insert_id: uuid.raw(),
        },
      ],
    },
    {
      "Content-type": "application/json",
    }
  );
}

function identify(apiKey, context = {}, traits = {}) {
  console.log("amplitude.identify");
  return request.post(
    "https://api.amplitude.com/identify",
    {
      api_key: apiKey,
      identification: {
        event_type: "identify",
        user_id: context.userId,
        device_id: context.anonymousId,
        user_properties: traits,
        os_name: _get(context, "ua.os.name"),
        os_version: _get(context, "ua.os.version"),
      },
    },
    {
      "Content-type": "application/json",
    }
  );
}

module.exports = {
  track,
  identify,
};
