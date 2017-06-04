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

const colors = {
  primary: '#6a9639',
  accent: '#3f51b5',
  info: '#3595bb',
  danger: '#eb6654',
  warning: '#ffbe30',
  success: '#88c163',
  grey: '#9fa3a7',
}

const colorScales = createColorScales(colors)

const flatColorScale = flattenColorScales(colorScales)

class App extends Component {
  state = {
    desaturate: 0.5,
  }
  render() {
    const { desaturate } = this.state
    function getTones(tone) {
      const tones = []
      for (let i = 0; i < 10; i++) {
        tones.push(tone(1 - i * 0.1))
      }
      return tones
    }
    return (
      <div>
        <h2>Color toner</h2>
        <label>Desaturate ({desaturate})</label>
        <input
          type="range"
          step={0.1}
          min={0}
          max={1}
          value={desaturate}
          onChange={e => this.setState({ desaturate: +e.target.value })}
        />
        {Object.keys(colors).map(key => {
          const color = colors[key]
          const tone = createTone(color, desaturate)
          const tones = getTones(tone)
          return (
            <div key={key}>
              {tones.map(_tone =>
                <div
                  key={_tone}
                  style={{
                    display: 'flex',
                    padding: 20,
                    backgroundColor: _tone,
                  }}
                >
                  {tones.map(tone =>
                    <div
                      key={tone}
                      style={{
                        flex: 1,
                        height: 50,
                        backgroundColor: tone,
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          )
        })}

        <h2>Color tones</h2>
        {Object.keys(colors).map(key => {
          const color = colorScales[key]
          return (
            <div
              key={key}
              style={{
                display: 'flex',
                padding: 20,
                backgroundColor: color.base,
              }}
            >
              {color.tones.map(tone =>
                <div
                  key={tone}
                  style={{
                    flex: 1,
                    height: 50,
                    backgroundColor: tone,
                  }}
                />
              )}
            </div>
          )
        })}

        <h2>Flat list of colors</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {Object.keys(flatColorScale).map(key =>
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
          )}
        </div>
      </div>
    )
  }
}

render(<App />, document.getElementById('app'))
