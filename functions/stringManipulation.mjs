/**
 * @link https://www.digitalocean.com/community/tutorials/js-capitalizing-strings
 * @param {string} string
 * @returns {string}
 */
export const capitalize = string => string.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));

/**
 * {@link https://1loc.dev/#convert-camel-case-to-kebab-case-and-vice-versa}
 * @param {string} string
 * @returns {string}
 */
export const kebabToCamel = string => string.replace(/-./g, m => m.toUpperCase()[1])

/**
 * {@link https://1loc.dev/#convert-camel-case-to-kebab-case-and-vice-versa}
 * @param {string} string
 * @returns {string}
 */
export const camelToKebab = string => string.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

/**
 * {@link https://gist.github.com/mathewbyrne/1280286/731b33268f7d8aea972a5aeef2c345496e8e5b18}
 * @param {string} text
 * @returns {string}
 */
export const slugify = text => text.toString().toLowerCase()
  .replace(/(\w)'/g, '$1')           // Special case for apostrophes
  .replace(/[^a-z0-9_\-]+/g, '-')     // Replace all non-word chars with -
  .replace(/--+/g, '-')             // Replace multiple - with single -
  .replace(/^-+/, '')                 // Trim - from start of text
  .replace(/-+$/, '')                // Trim - from end of text

/**
 * @param {string} slug
 * @param {boolean} capitalized
 * @returns {string}
 */
export const unslugify = (slug, capitalized = true) => (capitalized ? capitalize : x => x)(slug.replace(/-/g, ' '))

/**
 * @param {string} fullUrl
 * @param {boolean} removeProtocol
 * @param {boolean} removeWww
 * @returns {string}
 */
export const prettyUrl = (fullUrl, { removeProtocol = true, removeWww = false } = {}) =>
  fullUrl
    .replace(/(https?:\/\/)/i, removeProtocol ? '' : '$1')
    .replace(/(www.)/i, removeWww ? '' : '$1')