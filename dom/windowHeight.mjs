/**
 * Sets a custom property with the Windoe height + the initial property
 * @param {string=} initialVariable
 * @param {string=} variable
 */
const windowHeight = ({
                        initialVariable = '--initial-window-height',
                        variable = '--window-height',
                      } = {}) => {
  const setInitialWindowHeight = () => setTimeout(() => document.documentElement.style.setProperty(initialVariable, document.documentElement.clientHeight + 'px'), 75)
  setInitialWindowHeight()

  const setState = () => setTimeout(() => document.documentElement.style.setProperty(variable, document.documentElement.clientHeight + 'px'), 75)
  setState()

  window.windowListeners.resize.push(setState)

  // handle orientation change on iPad
  const userAgent = navigator.userAgent.toLowerCase()
  const iPad = () =>
    (!!userAgent.match(/mac/g) // ios
      && !userAgent.match(/phone/g)) // not phone

  if ((window.device && window.device.tablet()) || iPad()) {
    if (window.windowListeners)
      window.windowListeners.orientationchange.push(setState)
    else
      window.addEventListener('orientationchange', setState)
  }
}

export default windowHeight