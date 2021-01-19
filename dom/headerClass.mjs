/**
 * Toggles a class on the header, based on scroll and resize
 * @param {string=} headerIdentifier
 * @param {string=} toggleClass
 * @param {boolean=} toggleAdd
 * @param {string=} thresholdIdentifier
 * @param {number=} thresholdOffset
 * @param {boolean=} thresholdBottom
 * @param {boolean=} afterThreshold
 */
const headerClass = ({
                       headerIdentifier = 'data-site-header',
                       toggleClass = 'initial',
                       toggleAdd = false,
                       thresholdIdentifier = 'data-site-header-threshold',
                       thresholdOffset = 0,
                       thresholdBottom = false,
                       afterThreshold = false
                     } = {}) => {
  let $siteHeader = document.querySelector(`[${headerIdentifier}]`)
  if (!$siteHeader) return

  let $thresholdElement = document.querySelector(`[${thresholdIdentifier}]`)
  const offsetPosition = thresholdBottom ? 'bottom' : 'top'
  const offset = afterThreshold ? 0 : $siteHeader.clientHeight
  let threshold
  const setThreshold = () =>
    threshold =
      $thresholdElement
      ? $thresholdElement
        .getBoundingClientRect()[offsetPosition]
      - offset
      + document
        .documentElement
        .scrollTop
      + thresholdOffset

      : thresholdOffset

  setThreshold()
  const setHeaderClass = () => {
    const force = toggleAdd ? window.scrollY >= threshold : window.scrollY <= threshold
    $siteHeader.classList.toggle(toggleClass, force)
  }
  if (window.windowListeners) {
    windowListeners.scroll.push(setHeaderClass)
    windowListeners.resize.push(setThreshold)
  } else {
    window.addEventListener('scroll', setHeaderClass, { passive: true })
    window.addEventListener('resize', setThreshold, { passive: true })
  }
  setHeaderClass()
}

export default headerClass