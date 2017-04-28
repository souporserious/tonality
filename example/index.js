import React, { Component, createElement } from 'react'
import ReactDOM, { render } from 'react-dom'
import {
  createTone,
  createTones,
  createColorScale,
  createColorScales,
  flattenColorScales,
  getLightness,
} from '../src/index'

const colors = createColorScales({
  info: '#3595bb',
  danger: '#eb6654',
  warning: '#ffbe30',
  success: '#88c163',
  grey: '#9fa3a7',
})

const flatColorScale = flattenColorScales(colors)

class App extends Component {
  render() {
    return (
      <div>
        <h2>Color tones</h2>
        {Object.keys(colors).map(key => {
          const color = colors[key]
          return (
            <div
              key={key}
              style={{
                display: 'flex',
                padding: 20,
                backgroundColor: color.base,
              }}
            >
              {color.tones.map(tone => (
                <div
                  key={tone}
                  style={{
                    flex: 1,
                    height: 50,
                    backgroundColor: tone,
                  }}
                />
              ))}
            </div>
          )
        })}

        <h2>Flat list of colors</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {Object.keys(flatColorScale).map(key => (
            <span
              key={key}
              style={{
                padding: '8px 12px',
                backgroundColor: flatColorScale[key],
                color: getLightness(flatColorScale[key]) > 0.5
                  ? 'rgba(0, 0, 0, 0.5)'
                  : 'rgba(255, 255, 255, 0.5)',
              }}
              children={flatColorScale[key]}
            />
          ))}
        </div>
      </div>
    )
  }
}

render(<App />, document.getElementById('app'))
