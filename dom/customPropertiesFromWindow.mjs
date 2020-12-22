/**
 * @typedef {Object} EventProperties
 * @property {string} property
 * @property {string} variable
 * @property {string[]} events
 * @property {function(*): (string|number)} calculation
 */

/**
 * Sets custom properties based on events on the Window
 * @param {EventProperties[]} properties
 */
const customPropertiesFromWindow = ({
                                      properties = [{
                                        property: 'scrollY',
                                        variable: '--scroll-y',
                                        events: ['scroll', 'resize'],
                                        calculation: val => (val / window.innerHeight).toFixed(6)
                                      }]
                                    } = {}) => {

  for (const {property, variable, events, calculation} of properties) {
    const setState = () => {
      requestAnimationFrame(() => {
        let value = calculation ? calculation(window[property]) : window[property]
        document.documentElement.style.setProperty(variable, value)
      })
    }

    setState()
    for (const event of events)
      if (window.windowListeners && window.windowListeners[event])
        window.windowListeners[event].push(setState)
      else
        window.addEventListener(event, setState)
  }
}

export default customPropertiesFromWindow
