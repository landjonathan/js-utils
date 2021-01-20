/**
 * Set a custom property on elements with their respective scroll heights
 * @description A child selector can be set, e.g. <code>data-scroll-height=".content"</code>
 * @param {string=} identifier
 * @param {string=} variable Custom property set on element
 * @param {boolean|'tallest'|'shortest'=} whichChild Use tallest or shortent child, if child set. False for first child.
 * @param {string=} whichChildSelector
 */
const scrollHeight = ({
                        identifier = 'data-scroll-height',
                        variable = '--scroll-height',
                        whichChild = false,
                        whichChildSelector = 'data-scroll-height-which-child'
                      } = {}) => {
  const setScrollHeights = () => {
    document.querySelectorAll(`[${identifier}]`).forEach($el => {
      const childSelector = $el.getAttribute(identifier)
      const whichChild = whichChild || $el.getAttribute(whichChildSelector) || false
      let height
      let $sources = false
      if (childSelector) {
        if (whichChild) {
          $sources = $el.querySelectorAll(childSelector)
          const heights = [...$sources].map($source => $source.scrollHeight)
          switch (whichChild) {
            case 'tallest': height = Math.max(...heights); break
            case 'shortest': height = Math.min(...heights); break
          }
        } else {
          height = $el.querySelector(childSelector).scrollHeight
        }
      } else {
        height = $el.scrollHeight
      }

      $el.style.setProperty(variable, height + 'px')
    })
  }
  // after fonts and images loaded
  window.addEventListener('load', () => { setScrollHeights() })

  if (window.windowListeners)
    window.windowListeners.resize.push(setScrollHeights)
  else
    window.addEventListener('resize', setScrollHeights, { passive: true })
}

export default scrollHeight
