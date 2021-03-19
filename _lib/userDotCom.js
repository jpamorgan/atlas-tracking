// Docs: https://user.com/en/api/events/create-event
const request = require("./request");
const urlTools = require("./urlTools");

function track(apiKey, eventName, context = {}, props = {}) {
  console.log("userDotCom.track:", eventName);
  const body = {
    name: eventName,
    timestamp: Math.round(new Date().getTime() / 1000),
    data: { ...context, ...props, ...urlTools.getParts(context.url) },
  };
  if (!context.userId) body.client = context.anonymousId;
  return request.post(
    context.userId
      ? `https://conversion-ai.user.com/api/public/users-by-id/${context.userId}/events/`
      : "https://conversion-ai.user.com/api/public/events/",
    body,
    {
      "Content-type": "application/json",
      Authorization: `Token ${apiKey}`,
    }
  );
}

function identify(apiKey, userId, traits = {}) {
  console.log("userDotCom.identify:", userId);
  const body = {
    userId,
    first_name: traits.firstName,
    last_name: traits.lastName,
    company_id: traits.workspaceId,
  };
  return request.post(
    "https://conversion-ai.user.com/api/public/users/update_or_create/",
    body,
    {
      "Content-type": "application/json",
      Authorization: `Token ${apiKey}`,
    }
  );
}

module.exports = {
  track,
  identify,
};
