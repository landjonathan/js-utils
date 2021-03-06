/**
 * Sets up a slider, with an optional timer. Must set slide indexes, e.g. <code>data-slide="1"</code>.
 * @description interval can be set, e.g. <code>data-slideshow-timer="1000"</code>. Restart interval can be set, e.g. <code>data-slideshow-timer-restart="1000"</code>.
 * @param {string=} containerIdentifier
 * @param {string=} slideIdentifier
 * @param {string=} controlIdentifier
 * @param {string=} activeClass
 * @param {string=} nextClass
 * @param {string=} prevClass
 * @param {number|null=} interval
 * @param {string=} intervalIdentifier
 * @param {number|null=} restartTimerInterval
 * @param {string=} restartTimerIntervalIdentifier
 * @param {boolean=} removePrevAndNextClassesOnStop
 * @param {string[]} triggerEvents
 * @param {function(number, Element, Element, Element)=} onChange
 * @param {function(number, Element, Element, Element)=} beforeInit
 */
const slideshow = ({
                     containerIdentifier = 'data-slideshow',
                     slideIdentifier = 'data-slide',
                     controlIdentifier = 'data-control',
                     activeClass = 'active',
                     nextClass = 'next',
                     prevClass = 'prev',
                     interval = null,
                     intervalIdentifier = 'data-slideshow-timer',
                     restartTimerInterval = null,
                     restartTimerIntervalIdentifier = 'data-slideshow-timer-restart',
                     removePrevAndNextClassesOnStop = false,
                     triggerEvents = ['click'],
                     onChange,
                     beforeInit,
                   } = {}) => {
  const $containers = document.querySelectorAll(`[${containerIdentifier}]`)
  if (!$containers) return

  $containers.forEach($container => {
    const $slides = $container.querySelectorAll(`[${slideIdentifier}]`)
    const $controls = $container.querySelectorAll(`[${controlIdentifier}]`)
    const max = Math.max(...[...$slides].map($slide => parseInt($slide.getAttribute(slideIdentifier)))) || $slides.length
    let timer

    const interval = interval
      || parseInt($container.getAttribute(intervalIdentifier))
      || null

    const restartTimerInterval = restartTimerInterval
      || parseInt($container.getAttribute(restartTimerIntervalIdentifier))
      || null

    let index = [...$slides].findIndex($slide => $slide.classList.contains(activeClass))
    if (index === -1) index = 0

    const next = () => index === max ? 1 : index + 1
    const prev = () => index === 1 ? max : index - 1

    const setElementState = ($el, identifier) => {
      const elIndex = parseInt($el.getAttribute(identifier))
      $el.classList.toggle(activeClass, elIndex === index)

      if (interval) {
        nextClass && $el.classList.toggle(nextClass, elIndex === next())
        prevClass && $el.classList.toggle(prevClass, elIndex === prev())
        const relativeIndex = elIndex - index >= 0 ? elIndex - index : max + elIndex - index
        $el.dataset.activeIn = `${relativeIndex}`
        $el.dataset.activeAgo = `${relativeIndex === 0 ? 0 : max - relativeIndex}`
      }
    }
    
    const setState = newIndex => {
      index = newIndex || next()
      
      $slides.forEach($slide => {
        setElementState($slide, slideIdentifier)
      })

      $controls.forEach($control => {
        setElementState($control, controlIdentifier)
      })

      if (removePrevAndNextClassesOnStop && !timer) {
        [...$controls, ...$slides].forEach($el => {
          $el.classList.remove('prev')
          $el.classList.remove('next')
        })
      }

      $container.dataset.currentSlide = index

      typeof onChange === 'function' && onChange(index, $slides[index - 1], $controls[index - 1], $container)
    }

    const setTimer = () => {
      if (typeof interval === 'number') {
        timer = setInterval(setState, interval)
        $container.classList.add('with-timer')
      }
    }

    const unsetTimer = () => {
      clearInterval(timer)
      timer = null
      $container.classList.remove('with-timer')

      if (restartTimerInterval) {
        setTimeout(setTimer, restartTimerInterval)
      }
    }

    setTimer()

    $controls.forEach($control => {
      const listener = () => {
        if (timer) {
          unsetTimer()
        }
        setState(parseInt($control.getAttribute(controlIdentifier)))
      }
      triggerEvents.forEach(eventName => {
        $control.addEventListener(eventName, listener)
      })
    })

    typeof beforeInit === 'function' && beforeInit(index, $slides, $controls, $container)
    setState(index)
  })
}

export default slideshow