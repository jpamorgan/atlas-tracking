// Taken from https://developers.livechatinc.com/blog/setting-cookies-to-subdomains-in-javascript/

function setItem(name, value, days = 365) {
  // Only write to cookie if value less than 4096 bytes
  if (typeof TextEncoder !== 'undefined') {
    const encoder = new TextEncoder()
    const encodedValue = encoder.encode(value)
    if (encodedValue.length >= 3500) {
      // only print error message for atlas cookies
      if (name.toLowerCase().indexOf('atlas_') !== -1) console.log(`Could not write ${encodedValue.length} bytes to cookie. Value too large.`)
      return
    }
  }
  let domain
  let domainParts
  let date
  let expires
  let host

  if (days) {
    date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = `; expires=${date.toGMTString()}`
  } else {
    expires = ''
  }

  host = location.host
  if (host.split('.').length === 1) {
    // no "." in a domain - it's localhost or something similar
    document.cookie = `${name}=${value}${expires}; path=/`
  } else {
    // Remember the cookie on all subdomains.
    //
    // Start with trying to set cookie to the top domain.
    // (example: if user is on foo.com, try to set
    //  cookie to domain ".com")
    //
    // If the cookie will not be set, it means ".com"
    // is a top level domain and we need to
    // set the cookie to ".foo.com"
    domainParts = host.split('.')
    domainParts.shift()
    domain = `.${domainParts.join('.')}`

    document.cookie = `${name}=${value}${expires}; path=/; domain=${domain}`

    // check if cookie was successfuly set to the given domain
    // (otherwise it was a Top-Level Domain)
    if (getItem(name) == null || getItem(name) != value) {
      // append "." to current domain
      domain = `.${host}`
      document.cookie = `${name}=${value}${expires}; path=/; domain=${domain}`
    }
  }
}

function getItem(name) {
  const nameEQ = `${name}=`
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) == ' ') {
      c = c.substring(1, c.length)
    }

    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

function removeItem(name) {
  setItem(name, '', -1)
}

export default {
  setItem,
  getItem,
  removeItem,
}
