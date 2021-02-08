/**
 * Filters a list based on a value, or text content if none is set
 * @param {string=} containerIdentifier
 * @param {string=} inputIdentifier
 * @param {string=} listIdentifier
 * @param {string=} valueIdentifier
 * @param {string=} ignoredItemIdentifier
 * @param {string=} activeClass
 * @param {string=} inactiveClass
 * @param {boolean=} strict
 * @param {boolean=} toLowerCase
 * @param {function=} onBeforeFilter
 * @param {function=} onAfterFilter
 */
const filterList = ({
                      containerIdentifier = 'data-filter-container',
                      inputIdentifier = 'data-filter-input',
                      listIdentifier = 'data-filter-list',
                      valueIdentifier = 'data-filter-value',
                      ignoredItemIdentifier = 'data-filter-ignored',
                      activeClass = 'active',
                      inactiveClass = 'inactive',
                      strict = false,
                      toLowerCase = true,
                      onBeforeFilter,
                      onAfterFilter,
                    } = {}) => {
  document.querySelectorAll(`[${containerIdentifier}]`).forEach($container => {
    const $input = $container.querySelector(`[${inputIdentifier}]`)
    const $list = $container.querySelector(`[${listIdentifier}]`)
    const $items = $container.querySelectorAll(`[${valueIdentifier}]:not([${ignoredItemIdentifier}])`)

    if (!$input || !$list) return

    let setState = () => {
      if (typeof onBeforeFilter === 'function') onBeforeFilter($items, $list, $input, $container)

      const inputValue = toLowerCase ? $input.value.toLowerCase() : $input.value
      $items.forEach($item => {
        const valueSource = $item.getAttribute(valueIdentifier) === '' ? $item.textContent : $item.getAttribute(valueIdentifier)
        const itemValue = toLowerCase ? valueSource.toLowerCase() : valueSource
        const matches = strict ? inputValue === itemValue : itemValue.includes(inputValue)
        $item.classList.toggle(activeClass, matches || !inputValue)
        $item.classList.toggle(inactiveClass, !matches && inputValue)
      })

      if (typeof onAfterFilter === 'function') onAfterFilter($items, $list, $input, $container)
    }

    setState()
    $input.addEventListener('input', setState)
  })
}

export default filterList