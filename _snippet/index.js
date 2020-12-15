try {
  const inputUtils = require("./inputUtils").default;
  const trackEvent = require("./trackEvent").default;
  const cookies = require("./cookies").default;
  const uuid = require("../_lib/uuid");

  let storage =
    typeof window.localStorage !== "undefined"
      ? window.localStorage
      : { setItem: () => {}, getItem: () => {} };
  const STORAGE_PREFIX = "atlas_";

  function setItem(key, val, prefix) {
    try {
      cookies.setItem(prefix + key, val);
      storage.setItem(prefix + key, val);
    } catch (err) {
      // oh well
    }
  }

  /**
   * Set / overwrite the object at the given key
   * @param {string} key
   * @param {object} val
   * @param {string} prefix
   */
  function setObject(key, val, prefix) {
    try {
      setItem(key, JSON.stringify(val), prefix);
    } catch (err) {
      // oh well
    }
  }

  /**
   * Returns stored json object or {}
   * @param {string} key
   * @param {string} prefix
   */
  function getObject(key, prefix) {
    const cookieVal = cookies.getItem(prefix + key);
    const localStorageVal = storage.getItem(prefix + key);
    if (cookieVal || localStorageVal) {
      try {
        const cookieObj = JSON.parse(cookieVal);
        const localStorageObj = JSON.parse(localStorageVal);
        // Localstorage value takes priority
        return { ...cookieObj, ...localStorageObj };
      } catch (e) {
        console.error(e);
        return {};
      }
    }
    return {};
  }

  function getCachedValues(traits, context) {
    const existingTraits = getObject("traits", STORAGE_PREFIX);
    traits = { ...existingTraits, ...traits };
    if (traits.email && inputUtils.isValidEmail(traits.email)) {
      context = { ...context, email: traits.email };
    } else delete traits.email;
    if (traits.userId) {
      context = { ...context, userId: traits.userId };
    }
    return { traits, context };
  }

  window.atlas = window.atlas || {};

  let anonymousId = "";
  if (window.localStorage) {
    const ls = window.localStorage;
    anonymousId =
      ls.getItem("atlas_anonymousId") ||
      ls.getItem("ajs_anonymous_id") ||
      uuid.raw();
    ls.setItem("atlas_anonymousId", anonymousId);
    ls.setItem("ajs_anonymous_id", anonymousId);
  } else anonymousId = uuid.raw();

  window.atlas.context = {
    url: window.location.href,
    anonymousId,
    trackEmails: true,
    trackPageviews: true,
  };

  window.atlas.track =
    window.atlas.track ||
    function (event, props) {
      let cachedValues = getCachedValues(
        {},
        { ...window.atlas.context, ...props }
      );
      return trackEvent({ ...cachedValues.context, event });
    };
  window.atlas.identify =
    window.atlas.identify ||
    function (traits) {
      let cachedValues = getCachedValues(traits, window.atlas.context);

      setObject(
        "traits",
        {
          ...cachedValues.traits,
          email: cachedValues.context.email,
          userId: cachedValues.context.userId,
        },
        STORAGE_PREFIX
      );

      return trackEvent({
        ...cachedValues.context,
        traits: cachedValues.traits,
        event: "identify",
      });
    };

  if (window.atlas.context.trackEmails)
    inputUtils.watchForEmail(window.document, (email) =>
      window.atlas.identify({ email })
    );

  if (window.atlas.context.trackPageviews) window.atlas.track("pageview");
} catch (err) {
  console.log("Atlas error", err);
}
