module.exports = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  const whitelist = process.env.CORS_DOMAIN_WHITELIST;
  let whitelistMatch = false;
  if (whitelist) {
    const url = req.headers["referer"];
    whitelist.split(",").map((d) => {
      if (url.indexOf(d) !== -1) whitelistMatch = true;
    });
  }
  if (!whitelist || whitelistMatch)
    res.setHeader("Access-Control-Allow-Origin", "*");
  // another option
  // res.setHeader('Access-Control-Allow-Origin', req.header.origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};
