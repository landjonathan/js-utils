/**
 * Toggles a class on elements if in viewport, using IntersectionObserver.
 * @description Class name can be set as the data property, e.g. <code>data-in-view-class="active"</code>
 * @param {string=} identifier
 * @param {string=} defaultClassName
 * @param {string=} rootMargin
 * @param {number=} threshold
 * @param {boolean=} onLoadFromBottom
 * @param {boolean=} removeWhenOutOfView
 */
const inViewClass = (
  {
    identifier = 'data-in-view-class',
    defaultClassName = 'in-view',
    rootMargin = '-1px',
    threshold = .25,
    onLoadFromBottom = true,
    removeWhenOutOfView = false
  } = {},
) => {
  const addClass = $el => $el.classList.add($el.getAttribute(identifier) || defaultClassName)
  const removeClass = $el => $el.classList.remove($el.getAttribute(identifier) || defaultClassName)

  const observer = new IntersectionObserver(entries =>
    entries.forEach(entry => {
      if (entry.isIntersecting)
        addClass(entry.target)
      else if (removeWhenOutOfView)
        removeClass(entry.target)
    }), { rootMargin, threshold })

  document.querySelectorAll(`[${identifier}]`).forEach($el => {
    observer.observe($el)
    if (onLoadFromBottom && $el.getBoundingClientRect().top < 0 ) {
      addClass($el)
    }
  })
}

export default inViewClass