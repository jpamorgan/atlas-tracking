const amplitude = require("../_lib/amplitude");

module.exports = async (req, res) => {
  try {
    // if (req.headers.secret_key !== "fubar")
    //   throw new Error("Missing auth header");

    const { event, url, anonymousId, email, userId, traits, props } =
      req.body || {};

    if ((!userId && !email && !anonymousId) || !event || !url)
      throw new Error("Invalid event schema");

    await amplitude.send(
      event,
      {
        url,
        anonymousId,
        email,
        userId,
      },
      traits,
      props
    );

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(404).json({
      message: err.message || "There was an error processing this request",
    });
  }
};
