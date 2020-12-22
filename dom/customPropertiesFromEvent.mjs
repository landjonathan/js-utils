/**
 * @typedef {Object} EventValue
 * @property {string} key The property on the event whose value will be tracked (i.e. event[key])
 * @property {function(*): string|number} [calculation] Additional logic on the tracked value
 * @property {string} [variable] The css property name to be set. Defaults to a kebabed version of the key.
 */

/**
 * Sets css custom properties on target based on events
 *
 * @param {HTMLElement|Window} eventTarget The element whose events are tracked
 * @param {HTMLElement} propertyTarget The element on which properties are set
 * @param {string} name The name of the event
 * @param {EventValue[]} values
 */
const customPropertiesFromEvent = ({
                                     eventTarget = window,
                                     propertyTarget = document.documentElement,
                                     name = 'mousemove',
                                     values = [
                                       { key: 'clientX', calculation: x => (x / window.innerWidth).toFixed(6) },
                                       {
                                         key: 'clientY',
                                         calculation: y => (y / window.innerHeight).toFixed(6),
                                         variable: '--client-y'
                                       },
                                     ],
                                   } = {}) => {
  const setState = event => {
    requestAnimationFrame(() => {
      for (let { key, variable, calculation } of values) {
        variable = variable || '--' + key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
        if (event[key]) {
          const value = calculation ? calculation(event[key]) : event[key]
          propertyTarget.style.setProperty(variable, value)
        }
      }
    })
  }

  if (eventTarget === window && window.windowListeners && window.windowListeners[name])
    window.windowListeners[name].push(setState)
  else
    eventTarget.addEventListener(name, setState)
}

export default customPropertiesFromEvent