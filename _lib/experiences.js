// Docs: https://help.amplitude.com/hc/en-us/articles/360032842391-HTTP-API-V2
const uuid = require("./uuid");
const _get = require("lodash/get");
const request = require("./request");
const urlTools = require("./urlTools");

function track(workspaceId, eventName, context = {}, traits = {}, props = {}) {
  console.log("experiences.track:", eventName);
  return request.post(
    `https://e.proof-x.com/${workspaceId}/SEGMENT_WEBHOOK`,
    {
      type: "track",
      event: eventName,
      properties: props,
      anonymousId: context.anonymousId,
      context: {
        ...urlTools.getParts(context.url),
        url: context.url,
      },
      traits: {
        ...traits,
        userId: context.userId,
      },
      version: 1,
    },
    {
      "Content-type": "application/json",
    }
  );
}

function identify(workspaceId, context = {}, traits = {}) {
  console.log("experiences.identify");
  return request.post(
    `https://e.proof-x.com/${workspaceId}/SEGMENT_WEBHOOK`,
    {
      type: "identify",
      anonymousId: context.anonymousId,
      context: {
        ...urlTools.getParts(context.url),
        url: context.url,
      },
      traits: {
        ...traits,
        userId: context.userId,
      },
      version: 1,
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
