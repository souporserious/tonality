import { parseToRgb, parseToHsl, rgba, mix, toColorString } from 'polished'

// http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativelightnessdef
export function getLightness(color) {
  const rgbColor = parseToRgb(color)
  const [r, g, b] = Object.keys(rgbColor).map(key => {
    const channel = rgbColor[key] / 255
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// ported from ChromaJS
// https://github.com/gka/chroma.js/blob/d2c6d917df4ba2b87d8a740de116a0656bcbdfd5/src/io/lightness.coffee
const EPS = 1e-7

export function adjustLightness(amount, color) {
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
      const mixedlightness = getLightness(mixed)
      if (Math.abs(amount - mixedlightness) < EPS || !maxIteration--) {
        return mixed
      }
      if (mixedlightness > amount) {
        return test(color1, mixed)
      }
      return test(mixed, color2)
    }
    rgb = getLightness(color) > amount
      ? test('#000', color)
      : test(color, '#fff')
  }
  return rgb
}

export function adjustSaturation(amount, color) {
  const hsl = parseToHsl(color)
  hsl.saturation += hsl.saturation * amount
  return toColorString(hsl)
}

// Color pallette functions
export function createTone(color, desaturate = 0.5) {
  return value => {
    // we clamp the number so we can generate better shades if 0 or 1 are passed,
    // otherwise these colors would be pure black or white
    const lightnessAmount = Math.min(Math.max(value, 0.05), 0.95)
    return adjustSaturation(
      -value * desaturate,
      adjustLightness(lightnessAmount, color)
    )
  }
}

// calculations repurposed from jxnblk
// https://github.com/jxnblk/monochrome/blob/master/src/palette.js#L22-L34
export function createTones(color, desaturate) {
  const tone = createTone(color, desaturate)
  const lightness = getLightness(color)
  const lowerstep = lightness / 5
  const upperstep = (1 - lightness) / 6
  const lower = [4, 3, 2, 1].map(step => tone(step * lowerstep))
  const upper = [5, 4, 3, 2, 1, 0].map(step =>
    tone(lightness + step * upperstep)
  )
  return [...upper, ...lower]
}

export function createColorScale(color, desaturate) {
  return {
    base: color,
    text: getLightness(color) < 0.5 ? '#fff' : '#000',
    tone: createTone(color, desaturate),
    tones: createTones(color, desaturate),
  }
}

export function createColorScales(colors, desaturate) {
  function colorReducer(parsedColors, key) {
    return {
      ...parsedColors,
      [key]: createColorScale(colors[key], desaturate),
    }
  }
  return Object.keys(colors).reduce(colorReducer, {})
}

export function flattenColorScales(colors) {
  return Object.keys(colors).reduce((parsedColors, key) => {
    const color = colors[key]
    parsedColors[key] = color.base
    color.tones.forEach((tone, index) => {
      parsedColors[`${key}-${index}`] = tone
    })
    return parsedColors
  }, {})
}
