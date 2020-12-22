/**
 * Calculates reading time for a block of HTML
 * @param {string} htmlContent
 * @param {boolean=} printSeconds
 * @param {boolean=} raw
 * @param {number=} speed
 * @param {string=} minuteLabel
 * @param {string=} secondLabel
 * @param {boolean=} pluralize
 * @return {number | string}
 */
const readingTime = (htmlContent,
                     {
                       printSeconds = false,
                       raw = false,
                       speed = 300,
                       minuteLabel = 'minute',
                       secondLabel = 'second',
                       pluralize = true,
                     } = {},
) => {
  const content = htmlContent.replace(/(<([^>]+)>)/gi, '')

  const matches = content.match(/[\u0400-\u04FF]+|\S+\s*/g)
  const count = matches !== null ? matches.length : 0

  let est

  if (printSeconds === true) {
    const min = Math.floor(count / speed)
    const sec = Math.floor((count % speed) / (speed / 60))

    if (raw === false) {
      const mins = min + ' ' + (minuteLabel) + ((pluralize && min !== 1 ? 's' : '')) + ', '
      const secs = sec + ' ' + (secondLabel) + ((pluralize && sec !== 1 ? 's' : ''))
      est = min > 0 ? mins + secs : secs
    } else {
      est = min * 60 + sec
    }
  } else {
    const min = Math.ceil(count / speed)

    if (raw === false) {
      est = min + ' ' + (minuteLabel ? minuteLabel + ((pluralize && min !== 1 ? 's' : '')) : 'min')
    } else {
      est = min
    }
  }

  return est
}
export default readingTime