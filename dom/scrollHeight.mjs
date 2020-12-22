/**
 * Set a custom property on elements with their respective scroll heights
 * @description A child selector can be set, e.g. <code>data-scroll-height=".content"</code>
 * @param {string=} identifier
 * @param {string=} variable
 */
const scrollHeight = ({
                        identifier = 'data-scroll-height',
                        variable = '--scroll-height'
                      } = {}) => {
  const setScrollHeights = () => {
    document.querySelectorAll(`[${identifier}]`).forEach($el => {
      const data = $el.getAttribute(identifier);
      const source = data ? $el.querySelector(data) : value
      $el.style.setProperty(variable, source.scrollHeight + 'px')
    })
  }
  // after fonts and images loaded
  window.addEventListener('load', () => { setScrollHeights() })

  if (window.windowListeners)
    window.windowListeners.resize.push(setScrollHeights)
  else
    window.addEventListener('resize', setScrollHeights)
}

export default scrollHeight
