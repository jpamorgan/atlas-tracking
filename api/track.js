const amplitude = require("../_lib/amplitude");
const experiences = require("../_lib/experiences");
const facebook = require("../_lib/facebook");
const userDotCom = require("../_lib/userDotCom");
const parser = require("ua-parser-js");
const cors = require("../_lib/cors");

module.exports = cors(async (req, res) => {
  try {
    // if (req.headers.secret_key !== "fubar")
    //   throw new Error("Missing auth header");

    const { event, url, anonymousId, email, userId, traits, props } =
      req.body || {};

    if ((!userId && !email && !anonymousId) || !event || !url)
      throw new Error("Invalid event schema");

    const ip = req.headers["x-forwarded-for"];
    const userAgent = req.headers["user-agent"];
    const ua = parser(userAgent);

    function getUrlParams(url = "") {
      const search = url.split("?").length > 1 ? url.split("?")[1] : "";
      return search
        ? JSON.parse(
            '{"' +
              decodeURI(search)
                .replace(/"/g, '\\"')
                .replace(/&/g, '","')
                .replace(/=/g, '":"') +
              '"}'
          )
        : {};
    }
    var urlParams = getUrlParams(url);

    const work = [];

    if (process.env.AMPLITUDE_API_KEY) {
      work.push(
        amplitude.track(
          process.env.AMPLITUDE_API_KEY,
          event === "pageview" ? "pageLoad" : event,
          {
            url,
            anonymousId,
            email,
            userId,
            ip,
            ua,
          },
          {
            ...traits,
            ...urlParams,
          },
          {
            ...props,
            ...urlParams,
          }
        )
      );
    } else console.log("Missing amplitude api key");

    if (process.env.FACEBOOK_PIXEL_ID && process.env.FACEBOOK_ACCESS_TOKEN) {
      work.push(
        facebook.track(
          process.env.FACEBOOK_PIXEL_ID,
          process.env.FACEBOOK_ACCESS_TOKEN,
          event,
          {
            url,
            anonymousId,
            email,
            userId,
            ip,
            userAgent,
          },
          traits,
          props
        )
      );
    } else console.log("Missing Facebook keys");

    if (process.env.EXPERIENCES_WORKSPACE_ID) {
      work.push(
        experiences.track(
          process.env.EXPERIENCES_WORKSPACE_ID,
          event === "pageview" ? "pageLoad" : event,
          {
            url,
            anonymousId,
            email,
            userId,
            ip,
            ua,
          },
          {
            ...traits,
            ...urlParams,
          },
          {
            ...props,
            ...urlParams,
          }
        )
      );
    } else console.log("Missing experiences workspaceId");

    if (process.env.USER_DOT_COM_API_KEY) {
      if (event === "identify" && userId)
        work.push(
          userDotCom.identify(process.env.USER_DOT_COM_API_KEY, userId, traits)
        );
      else
        work.push(
          userDotCom.track(
            process.env.USER_DOT_COM_API_KEY,
            event,
            {
              url,
              anonymousId,
              email,
              userId,
              ip,
              userAgent,
            },
            props
          )
        );
    }

    const results = await Promise.allSettled(work);

    res.json({
      amp: process.env.AMPLITUDE_API_KEY ? true : "Missing amp api key",
      fbt: process.env.FACEBOOK_ACCESS_TOKEN ? true : "Missing fb token",
      fbp: process.env.FACEBOOK_PIXEL_ID ? true : "Missing fb pixel",
      user: process.env.USER_DOT_COM_API_KEY ? true : "Missing user api key",
      results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "There was an error processing this request",
      error: err,
    });
  }
});
