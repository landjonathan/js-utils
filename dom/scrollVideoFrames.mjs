/**
 * Loads a video into a canvas and scrubs frames on scroll
 * @param {string=} canvasIdentifier
 * @param {HTMLElement=} $container
 * @param {number=} frameWidth
 * @param {number=} frameHeight
 * @param {'left'|'right'|null=} originX
 * @param {'top'|'right'|null=} originY
 * @param {boolean=} sizeCover
 * @param {boolean=} waitForDoneLoading
 * @param {number=} splitLoading
 * @param {function=} loadedCallback
 */
const scrollVideoFrames = ({
                             canvasIdentifier = 'data-scroll-video-canvas',
                             $container = document.documentElement,
                             frameWidth = window.innerWidth,
                             frameHeight = window.innerHeight,
                             originX = null,
                             originY = null,
                             sizeCover = true,
                             waitForDoneLoading = false,
                             splitLoading = 4,
                             loadedCallback
                           } = {}) => {
  document.querySelectorAll(`[${canvasIdentifier}]`).forEach($canvas => {
    if (getComputedStyle($canvas).display === 'none') return

    // setup canvas
    const context = $canvas.getContext('2d')
    if (!sizeCover) {
      $canvas.width = innerWidth
      $canvas.height = innerHeight
    }

    // setup images
    const draw = img => {
      if (!img) return

      let dx = ($canvas.width - frameWidth) / 2
      let dy = ($canvas.height - frameHeight) / 2
      let dw = img.width
      let dh = img.height

      if (sizeCover) {
        // https://riptutorial.com/html5-canvas/example/19169/scaling-image-to-fit-or-fill-
        const scale = Math.max($canvas.width / img.width, $canvas.height / img.height)
        dx = ($canvas.width / 2) - (img.width / 2) * scale
        dy = ($canvas.height / 2) - (img.height / 2) * scale
        dw = img.width * scale
        dh = img.height * scale
      } else {
        if (originX === 'left')
          dx = 0
        else if (originX === 'right')
          dx = $canvas.width - frameWidth
        if (originY === 'top')
          dy = 0
        else if (originY === 'bottom')
          dy = $canvas.height - frameHeight
      }

      context.drawImage(img, dx, dy, dw, dh)
    }

    const urlTemplate = $canvas.getAttribute(canvasIdentifier)
    const urlTemplateLastNumber = urlTemplate.split('.').slice(-2, -1)[0].split('/').slice(-1)[0]
    const urlPadding = urlTemplateLastNumber.length
    const urlAtIndex = index => urlTemplate.replace(urlTemplateLastNumber, index.toString().padStart(urlPadding, '0'))
    const frameCount = parseInt(urlTemplateLastNumber)
    const images = [null]
    const loaded = []
    let isDoneLoading = false

    images[1] = new Image()
    images[1].src = urlAtIndex(1)
    images[1].onload = () => {
      draw(images[1])
      if (sizeCover) {
        $canvas.width = images[1].width
        $canvas.height = images[1].height
      }
    }

    const setDoneLoading = () => {
      isDoneLoading = true
      if (typeof loadedCallback === 'function')
        loadedCallback()
    }

    const preloadImages = () => {
      splitLoading = splitLoading || 1
      let j
      for (let i = 1; i <= splitLoading; i++) {
        for (j = i; j <= frameCount; j += splitLoading) {
          if (urlAtIndex(j)) {
            images[j] = new Image()
            images[j].src = urlAtIndex(j)
            images[j].onload = () => {
              loaded.push(j)
              if (loaded.length === frameCount) {
                setDoneLoading()
              }
            }
          }
        }
      }
    }
    preloadImages()

    const updateImage = i => {
      draw(images[i])
    }

    const setFrame = () => {
      if (getComputedStyle($canvas).display === 'none') return
      if (waitForDoneLoading && !isDoneLoading) return

      const scrollTop = -1 * ($container.getBoundingClientRect().top)
      const maxScrollTop = $container.scrollHeight - window.innerHeight
      const scrollFraction = scrollTop / maxScrollTop
      const frameIndex = Math.max(0,
        Math.min(frameCount - 1,
          Math.floor(scrollFraction * frameCount)
        )
      )
      requestAnimationFrame(() => updateImage(frameIndex + 1))
    }

    // setup listeners
    const onResize = () => {
      if (!sizeCover) {
        if ($canvas.width !== innerWidth || $canvas.height !== innerHeight) {
          $canvas.width = innerWidth
          $canvas.height = innerHeight
        }
      }
      setFrame()
    }

    if (window.windowListeners) {
      windowListeners.scroll.push(setFrame)
      windowListeners.resize.push(onResize)
    } else {
      window.addEventListener('scroll', setFrame)
      window.addEventListener('resize', onResize)
    }

    document.addEventListener('load', setFrame)
  })
}

export default scrollVideoFrames