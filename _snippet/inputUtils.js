// Track event listeners so we can remove them when needed
let eventHandlers = {}

/**
 * Add an event listener to an element
 * @param {object} node
 * @param {object} event
 * @param {function} handler
 * @param {boolean} capture
 */
const addEventListener = (node, event, handler, capture) => {
  if (!(node in eventHandlers)) {
    // eventHandlers stores references to nodes
    eventHandlers[node] = {}
  }
  if (!(event in eventHandlers[node])) {
    // each entry contains another entry for each event type
    eventHandlers[node][event] = []
  }
  // track listener reference
  eventHandlers[node][event].push([handler, capture])
  node.addEventListener(event, handler, capture)
}

/**
 * Check if input is valid email
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  // check that email is not null
  if (email) {
    // value of field with whitespace trimmed off
    const trimmedEmail = email.trim()

    // eslint-disable-next-line
    const emailFilter = /^[^@]+@[^@.]+\.[^@]*\w\w$/
    // eslint-disable-next-line
    const illegalChars = /[\(\)\<\>\,\;\:\\\"\[\]]/

    // check for whitespace
    if (trimmedEmail.indexOf(' ') >= 0) {
      return false
    }
    // check that email is not an empty string
    if (trimmedEmail === '') {
      return false
    }
    // check for illegal characters
    if (!emailFilter.test(trimmedEmail)) {
      return false
    }
    // check for illegal characters
    if (trimmedEmail.match(illegalChars)) {
      return false
    }
    return true
  }
  return false
}

/**
 * Trigger callback when visitor leaves a field
 */
const trackOnBlur = (field, callback) => () => {
  callback(field.value)
}

/**
 * Trigger callback presses down on a the RETURN key
 * @param {object} e kepress event object
 */
const trackOnReturn = (field, callback) => (e) => {
  if (e.keyCode === 13) {
    if (typeof callback === 'function') callback(field.value)
  }
}

/**
 * Sync the input of a specific field
 * @param {object} field the field you want to track
 */
const trackInput = (field, callback) => {
  addEventListener(field, 'blur', trackOnBlur(field, callback))
  addEventListener(field, 'keypress', trackOnReturn(field, callback))
}

/**
 * Loop through all inputs on the page
 * @param {HTMLElement} doc
 * @param {function} callback
 * @returns {NodeList} Node list of inputs on the page
 */
const getAllInputs = (doc, callback) => {
  const inputs = doc.getElementsByTagName('input')
  for (let i = 0; i < inputs.length; i++) {
    callback(inputs[i])
  }
  return inputs
}

/**
 * Add event listeners to all text + email input elements and watch for valid email addresses
 * @param {object} doc
 * @param {function} callback
 */
const watchForEmail = (doc, callback) => {
  getAllInputs(doc, (input) => {
    const inputType = input.type.toLowerCase()
    if (inputType === 'email' || inputType === 'text') {
      trackInput(input, (val) => {
        if (isValidEmail(val)) callback(val)
      })
    }
  })
}

export default {
  watchForEmail,
  isValidEmail,
}
