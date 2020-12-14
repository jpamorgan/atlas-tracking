import request from '../_lib/request'

/**
 * Track an event to the tracking API
 * @param {object} event
 */
export default (event) => {
  return request.post(`${__EVENTS_ENDPOINT__}/api/track`, event)
}
