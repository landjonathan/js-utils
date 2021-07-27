/**
 * @link https://www.digitalocean.com/community/tutorials/js-capitalizing-strings
 * */
export const capitalize = (string: String): String => string.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));

export const capitalizeFirstLetter = (string: String): String => string.trim().toLowerCase().replace(/\w\S*/, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));

/**
 * {@link https://1loc.dev/#convert-camel-case-to-kebab-case-and-vice-versa}
 */
export const kebabToCamel = (string: String): String => string.replace(/-./g, m => m.toUpperCase()[1])

/**
 * {@link https://1loc.dev/#convert-camel-case-to-kebab-case-and-vice-versa}
 */
export const camelToKebab = (string: String): String => string.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

/**
 * {@link https://gist.github.com/mathewbyrne/1280286/731b33268f7d8aea972a5aeef2c345496e8e5b18}
 */
export const slugify = (text: String): String => text.toString().toLowerCase()
  .replace(/(\w)'/g, '$1')           // Special case for apostrophes
  .replace(/[^a-z0-9_\-]+/g, '-')     // Replace all non-word chars with -
  .replace(/--+/g, '-')             // Replace multiple - with single -
  .replace(/^-+/, '')                 // Trim - from start of text
  .replace(/-+$/, '')                // Trim - from end of text

export const unslugify = (slug: String, capitalized = true): String => (capitalized ? capitalize : x => x)(slug.replace(/-/g, ' '))

export const prettyUrl = (fullUrl: String, { removeProtocol = true, removeWww = false } = {}): String =>
  fullUrl
    .replace(/(https?:\/\/)/i, removeProtocol ? '' : '$1')
    .replace(/(www.)/i, removeWww ? '' : '$1')