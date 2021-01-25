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
 * @param {function(number, Element, Element, Element)=} onChange
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
                     onChange
                   } = {}) => {
  const $containers = document.querySelectorAll(`[${containerIdentifier}]`)
  if (!$containers) return

  $containers.forEach($container => {
    const $slides = $container.querySelectorAll(`[${slideIdentifier}]`)
    const $controls = $container.querySelectorAll(`[${controlIdentifier}]`)
    const max = Math.max(...[...$slides].map($slide => parseInt($slide.getAttribute(slideIdentifier)))) || $slides.length
    let timer

    interval = interval
      || parseInt($container.getAttribute(intervalIdentifier))
      || null

    restartTimerInterval = restartTimerInterval
      || parseInt($container.getAttribute(restartTimerIntervalIdentifier))
      || null

    let index = [...$slides].findIndex($slide => $slide.classList.contains(activeClass))

    const next = () => index === max ? 1 : index + 1
    const prev = () => index === 1 ? max : index - 1

    const setState = newIndex => {
      index = newIndex || next()

      $slides.forEach($slide => {
        $slide.classList.toggle(activeClass, parseInt($slide.getAttribute(slideIdentifier)) === index)
        nextClass && $slide.classList.toggle(nextClass, parseInt($slide.getAttribute(slideIdentifier)) === next())
        prevClass && $slide.classList.toggle(prevClass, parseInt($slide.getAttribute(slideIdentifier)) === prev())
      })

      $controls.forEach($control => {
        $control.classList.toggle(activeClass, parseInt($control.getAttribute(controlIdentifier)) === index)
        nextClass && $control.classList.toggle(nextClass, parseInt($control.getAttribute(controlIdentifier)) === next())
        prevClass && $control.classList.toggle(prevClass, parseInt($control.getAttribute(controlIdentifier)) === prev())
      })

      if (removePrevAndNextClassesOnStop && !timer) {
        [...$controls, ...$slides].forEach($el => {
          $el.classList.remove('prev')
          $el.classList.remove('next')
        })
      }

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
      $control.addEventListener('click', () => {
        if (timer) {
          unsetTimer()
        }
        setState(parseInt($control.getAttribute(controlIdentifier)))
      })
    })

    setState()
  })
}

export default slideshow