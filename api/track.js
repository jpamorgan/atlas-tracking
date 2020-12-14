const amplitude = require("../_lib/amplitude");
const facebook = require("../_lib/facebook");
const parser = require("ua-parser-js");

module.exports = async (req, res) => {
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

    function getUrlParams(url) {
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
    var urlParams = getUrlParams();

    const promises = [];

    if (process.env.AMPLITUDE_API_KEY) {
      // if (event === "identify")
      //   promises.push(
      //     amplitude.identify(
      //       process.env.AMPLITUDE_API_KEY,
      //       {
      //         url,
      //         anonymousId,
      //         email,
      //         userId,
      //         ip,
      //         ua,
      //       },
      //       traits
      //     )
      //   );
      // else
      promises.push(
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
          traits,
          {
            ...props,
            ...urlParams,
          }
        )
      );
    } else console.log("Missing amplitude api key");

    if (process.env.FACEBOOK_PIXEL_ID && process.env.FACEBOOK_ACCESS_TOKEN) {
      promises.push(
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
