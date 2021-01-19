/**
 * Initialized listeners and setupFunctions
 * @param {function[]} setupFunctions Functions to run
 * @param {boolean} listeners
 */
const initSite = (setupFunctions, listeners = true) => {

  const initListeners = () => {
    window.windowListeners = {
      resize: [],
      scroll: [],
      click: [],
      orientationchange: [],
      mousemove: [],
    }

    // for each event name
    for (let eventName in window.windowListeners) {

      // add a listener for the event
      // noinspection JSUnfilteredForInLoop
      window.addEventListener(eventName, event => {
        // noinspection JSUnfilteredForInLoop
        const listener = window.windowListeners[eventName];

        // with all the functions defined on it
        for (let fn in listener) {
          if (listener.hasOwnProperty(fn)) listener[fn](event)
        }
      })
    }
  }
  if (listeners)
    initListeners()

  setupFunctions.forEach(fn => {
    fn()
  })
}

export default initSite