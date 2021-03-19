/**
 * Check if string is a valid  URL
 * @param {string} url
 */
const isValidUrl = (url) => {
  var pattern = new RegExp(
    "^(https?:\\/\\/)" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(url);
};

/**
 * Get the key parts of a url in object form
 * @param {string} url
 * @returns {object}
 */
const getParts = (url) => {
  if (!url) return "";
  // Add missing protocol
  let pageUrl = url.match("http[s]?://") ? url : `https://${url}`;
  if (isValidUrl(pageUrl) || pageUrl.indexOf("http://localhost") !== -1) {
    // Remove query string
    pageUrl = new URL(pageUrl);
    return {
      domain: pageUrl.host,
      path: pageUrl.pathname,
      queryString: pageUrl.search,
    };
  } else return {};
};

module.exports = {
  getParts,
};
