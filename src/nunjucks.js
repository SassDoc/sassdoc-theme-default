import chroma from 'chroma-js'
import nunjucks from 'nunjucks'

var nunjucksEnv = nunjucks.configure('views');

const safe = fn =>
  (fn.safe = true) && fn

const isColor = value => {
  try {
    chroma(value)
    return true
  } catch (e) {
    return false
  }
}

const displayAsType = input =>
  input.split('|')
    .map(x => x.trim())
    .map(nunjucksEnv.getFilter('capitalize'))
    .join('</code> or <code>')

const yiq = ([red, green, blue]) =>
  ((red * 299) + (green * 587) + (blue * 114)) / 1000

const yiqContrast = rgb =>
  (yiq(rgb) >= 128) ? '#000' : '#fff'

const getChannel = (start, hex) =>
  parseInt(hex.substr(start, 2), 16)

const hexToRgb = hex =>
  [0, 2, 4].map(x => getChannel(x, hex))

const colorToHex = color =>
  chroma(color).hex().substr(1)

const pluralize = input =>
  input.toLowerCase()
    .substring(input.length - 1) === 's'
    ? input
    : input + 's'

// Prevent escaping chars from being printed.
// See sassdoc/sassdoc#531
const unescape = input =>
  input.replace(/\\/g, '')

/**
 * Normalises a CSS color, then uses the YIQ algorithm to get the
 * correct contrast.
 *
 * @param {String} color
 * @return {String} `#000` or `#fff` depending on which one is a better.
 * @see {@link http://stackoverflow.com/questions/11867545/change-text-color-based-on-brightness-of-the-covered-background-area}
 */
const maybeYiqContrast = color =>
  isColor(color)
    ? yiqContrast(hexToRgb(colorToHex(color)))
    : '#000'

nunjucksEnv.addFilter('in', (key, object) => key in object)
nunjucksEnv.addFilter('is_color', isColor)
nunjucksEnv.addFilter('display_as_type', safe(displayAsType))
nunjucksEnv.addFilter('yiq', maybeYiqContrast)
nunjucksEnv.addFilter('pluralize', pluralize)
nunjucksEnv.addFilter('unescape', unescape)

// debug
nunjucksEnv.addGlobal('debug', function () {
  return this.ctx;
})

/**
 * Warning: The simple API (above; e.g. nunjucks.render) always uses the configuration from the most recent call to nunjucks.configure. Since this is implicit and can result in unexpected side effects, use of the simple API is discouraged in most cases (especially if configure is used); instead, explicitly create an environment using var env = nunjucks.configure(...) and then call env.render(...) etc.
 *
 * Investigate why it doens't work like this if I export nunjucksEnv instead
 * https://mozilla.github.io/nunjucks/api.html#configure
 */
export default nunjucks;