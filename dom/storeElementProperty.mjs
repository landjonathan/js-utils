/**
 * Stores an element's value in storage.
 *
 * Multiple events can be tracked with a comma separated list (e.g. <code>data-store-property-event="input,change"</code>.)
 * @param {string=} elementIdentifier
 * @param {string=} valueIdentifier
 * @param {string=} eventIdentifier
 * @param {string=} namespace
 * @param {Storage=} storage
 * @param {string[]=} defaultProperties
 * @param {string[]=} defaultEvents
 * @return {void}
 */
const storeElementProperty = ({
                                elementIdentifier = 'data-store-property',
                                valueIdentifier = 'data-store-property-value',
                                eventIdentifier = 'data-store-property-event',
                                namespace = 'elements',
                                storage = localStorage,
                                defaultProperties = ['value'],
                                defaultEvents = ['input'],
                              } = {}) => {
  const $elements = document.querySelectorAll(`[${elementIdentifier}]`)
  if (!$elements) return

  $elements.forEach($element => {
    const id = $element.getAttribute(elementIdentifier) || $element.id
    const propertyNames = $element.getAttribute(valueIdentifier)?.split(',') ?? defaultProperties
    const eventNames = $element.getAttribute(eventIdentifier)?.split(',') ?? defaultEvents
    const name = $element.name

    eventNames.forEach(eventName => {
      for (const propertyName of propertyNames) {
        const key = `${namespace}.${id}.${propertyName}`
        const storedValue = storage.getItem(key)
        if (typeof storedValue !== 'undefined') {
          $element[propertyName] = JSON.parse(storedValue)
        }
      }

      const setStateForEvent = () => {
        for (const propertyName of propertyNames) {
          const key = `${namespace}.${id}.${propertyName}`
          const value = $element[propertyName]
          if (typeof value === 'undefined') continue
          storage.setItem(key, JSON.stringify(value))
        }
      }

      $element.addEventListener(eventName, setStateForEvent)

      // track other radio group elements
      if (name) {
        [...$elements].filter($groupElement => $groupElement.name === name).forEach($groupElement => {
          $groupElement.addEventListener(eventName, setStateForEvent)
        })
      }
    })
  })
}

export default storeElementProperty