import React, { Component, createElement } from 'react'
import ReactDOM, { render } from 'react-dom'
import {
  createTone,
  createTones,
  createColorScale,
  createColorScales,
  flattenColorScales,
} from '../src/index'

const colors = createColorScales({
  info: '#3595bb',
  danger: '#eb6654',
  warning: '#ffbe30',
  success: '#88c163',
  grey: '#9fa3a7',
})

class App extends Component {
  render() {
    return (
      <div>
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
      </div>
    )
  }
}

render(<App />, document.getElementById('app'))
