import {
  parseToRgb,
  parseToHsl,
  setLightness,
  setSaturation,
  lighten,
  darken,
  rgba,
  mix,
  toColorString,
} from 'polished'

// Color helpers

// ported from ChromaJS
// https://github.com/gka/chroma.js/blob/d2c6d917df4ba2b87d8a740de116a0656bcbdfd5/src/io/luminance.coffee
const EPS = 1e-7

function setLuminance(amount, color) {
  const { red, green, blue, alpha = 1 } = parseToRgb(color)
  let rgb
  if (amount === 0) {
    rgb = rgba(0, 0, 0, alpha)
  } else if (amount === 1) {
    rgb = rgba(255, 255, 255, alpha)
  } else {
    let maxIteration = 20
    const test = (color1, color2) => {
      const mixed = mix(0.5, color1, color2)
      const mixedLuminance = getLuminance(mixed)
      if (Math.abs(amount - mixedLuminance) < EPS || !maxIteration--) {
        return mixed
      }
      if (mixedLuminance > amount) {
        return test(color1, mixed)
      }
      return test(mixed, color2)
    }
    rgb = getLuminance(color) > amount
      ? test('#000', color)
      : test(color, '#fff')
  }
  return rgb
}

// http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
function getLuminance(color) {
  const rgbColor = parseToRgb(color)
  const [r, g, b] = Object.keys(rgbColor).map(key => {
    const channel = rgbColor[key] / 255
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function saturate(amount, color) {
  const hsl = parseToHsl(color)
  hsl.saturation += hsl.saturation * amount
  return toColorString(hsl)
}

// Color pallette functions
export function createTone(color, saturation = 0.25) {
  return value => saturate(-value * saturation, setLuminance(value, color))
}

// calculations repurposed from jxnblk
// https://github.com/jxnblk/monochrome/blob/master/src/palette.js#L22-L34
export function createTones(color, saturation) {
  const tone = createTone(color)
  const luminance = getLuminance(color)
  const lowerstep = luminance / 5
  const upperstep = (1 - luminance) / 6
  const lower = [4, 3, 2, 1].map(step => tone(step * lowerstep))
  const upper = [5, 4, 3, 2, 1, 0].map(step =>
    tone(luminance + step * upperstep)
  )
  return [...upper, ...lower]
}

export function createColorScale(color, saturation) {
  return {
    base: color,
    text: getLuminance(color) < 0.5 ? '#fff' : '#000',
    tone: createTone(color, saturation),
    tones: createTones(color, saturation),
  }
}

export function createColorScales(colors, saturation) {
  return Object.keys(colors).reduce(
    (parsedColors, key) => ({
      ...parsedColors,
      [key]: createColorScale(colors[key], saturation),
    }),
    {}
  )
}

export function flattenColorScales(colors) {
  return Object.keys(colors).reduce((parsedColors, key) => {
    const color = colors[key]
    parsedColors[key] = color.base
    color.shades.forEach((shade, index) => {
      parsedColors[`${key}-${index}`] = shade
    })
    return parsedColors
  }, {})
}
