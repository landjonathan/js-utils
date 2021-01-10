/**
 * Toggles a class on elements if in viewport, using IntersectionObserver.
 * @description Class name can be set as the data property, e.g. <code>data-in-view-class="active"</code>
 * @param {string=} identifier
 * @param {string=} defaultClassName
 * @param {string=} rootMargin
 * @param {number=} threshold
 * @param {boolean=} onLoadFromBottom
 * @param {boolean=} removeWhenOutOfView
 * @param {string[]=} additionalSelectors
 * @return {void}
 */
const inViewClass = (
  {
    identifier = 'data-in-view-class',
    defaultClassName = 'in-view',
    rootMargin = '-1px',
    threshold = .25,
    onLoadFromBottom = true,
    removeWhenOutOfView = false,
    additionalSelectors,
  } = {},
) => {
  const addClass = $el => $el.classList.add($el.getAttribute(identifier) || defaultClassName)
  const removeClass = $el => $el.classList.remove($el.getAttribute(identifier) || defaultClassName)
  let selectors = `[${identifier}]`
  if (additionalSelectors.length)
    selectors += `,${additionalSelectors.join(',')}`

  const observer = new IntersectionObserver(entries =>
    entries.forEach(entry => {
      if (entry.isIntersecting)
        addClass(entry.target)
      else if (removeWhenOutOfView)
        removeClass(entry.target)
    }), { rootMargin, threshold })

  document.querySelectorAll(selectors).forEach($el => {
    observer.observe($el)
    if (onLoadFromBottom && $el.getBoundingClientRect().top < 0 ) {
      addClass($el)
    }
  })
}

export default inViewClass