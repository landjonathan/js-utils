/**
 * Toggles a class on scroll on elements and their labels
 * @param {string=} containerIdentifier
 * @param {string=} elementIdentifier
 * @param {string=} labelIdentifier
 * @param {string=} overflowIdentifier
 * @param {string=} offsetIdentifier
 * @param {number=} offsetTop
 * @param {boolean=} useOffsetElementMarginBottom
 * @param {boolean=} markLabels
 * @param {boolean=} markElements
 * @param {string=} toggleClass
 * @param {boolean=} scrollToTargetLabel
 * @param {boolean=} firstActiveIfAbove
 * @param {function(object, HTMLElement[], HTMLElement[])=} onChanged
 */
const scrollActiveLabel = ({
                             containerIdentifier = 'data-scroll-labels-container',
                             elementIdentifier = 'data-scroll-element',
                             labelIdentifier = 'data-scroll-label',
                             overflowIdentifier = 'data-scroll-overflow',
                             offsetIdentifier = 'data-site-header',
                             offsetTop = 0,
                             useOffsetElementMarginBottom = true,
                             markLabels = true,
                             markElements = true,
                             toggleClass = 'active',
                             scrollToTargetLabel = true,
                             firstActiveIfAbove = false,
                             onChanged,
                           } = {}) => {
  const $offsetElement = document.querySelector(`[${offsetIdentifier}]`)
  if (!$offsetElement) return

  const offset = $offsetElement.getBoundingClientRect().height + (useOffsetElementMarginBottom ? parseFloat(getComputedStyle($offsetElement).marginBottom) + 1 : 0)

  document.querySelectorAll(`[${containerIdentifier}]`).forEach($container => {
    const $elements = $container.querySelectorAll(`[${elementIdentifier}]`)
    const $labels = $container.querySelectorAll(`[${labelIdentifier}]`)
    const $nav = $container.querySelector(`[${overflowIdentifier}]`)

    let lastTarget = {}

    const setState = () => requestAnimationFrame(() => {
      const tops = {}
      let currentTarget = { top: -Infinity }

      $elements.forEach($el => {
        const key = $el.getAttribute(elementIdentifier) || $el.getAttribute('id')
        tops[key] = $el.getBoundingClientRect().top - offset - offsetTop
      })

      for (const [key, top] of Object.entries(tops)) {
        if (top <= 0) {
          if (top > currentTarget.top) {
            currentTarget = { key, top }
          }
        }
      }

      const isActive = ($el, i) => ($el.getAttribute(labelIdentifier) || ($el.getAttribute('href') && $el.getAttribute('href').replace('#', ''))) === currentTarget.key
        || i === 0 && firstActiveIfAbove && !currentTarget.key

      if (markLabels)
        $labels.forEach(($el, i) => $el.classList.toggle(toggleClass, isActive($el, i)))
      if (markElements)
        $elements.forEach(($el, i) => $el.classList.toggle(toggleClass, isActive($el, i)))

      if (!lastTarget.key || lastTarget.key !== currentTarget.key) {
        if (typeof onChanged === 'function' && lastTarget.key) {
          onChanged(
            lastTarget,
            [...$elements].filter($el => ($el.getAttribute(elementIdentifier) || $el.getAttribute('id')) === lastTarget.key),
            [...$labels].filter($el => ($el.getAttribute(labelIdentifier) || $el.getAttribute('href').replace('#', '')) === lastTarget.key),
          )
        }

        lastTarget = currentTarget

        const $firstActiveLabel = [...$labels].find($label => $label.classList.contains(toggleClass))
        if ($firstActiveLabel && scrollToTargetLabel && $nav) {
          let target
          if (window.lang === 'he') {
            const labelWidth = $firstActiveLabel.clientWidth + parseFloat(getComputedStyle($firstActiveLabel).marginRight) + parseFloat(getComputedStyle($nav).paddingRight)
            const labelStart = $firstActiveLabel.offsetLeft + labelWidth
            target = ($nav.scrollWidth - $nav.clientWidth) - ($nav.clientWidth - labelStart)
            if (window.device && window.device.ios()) {
              target = target - ($nav.scrollWidth - $nav.clientWidth)
            }
          } else {
            target = $firstActiveLabel.offsetLeft - parseFloat(getComputedStyle($firstActiveLabel).marginLeft) - parseFloat(getComputedStyle($nav).paddingLeft)
          }

          $nav.scrollTo({
            behavior: 'smooth',
            left: target,
          })
        }
      }
    })

    setState()

    if (window.windowListeners)
      window.windowListeners.scroll.push(setState)
    else
      window.addEventListener('scroll', setState)
  })
}

export default scrollActiveLabel