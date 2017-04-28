## Tonality

[![npm version](https://badge.fury.io/js/tonality.svg)](https://badge.fury.io/js/tonality)
[![Dependency Status](https://david-dm.org/souporserious/tonality.svg)](https://david-dm.org/souporserious/tonality)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Some small functions to help build and adjust color tone palettes.

![tonality](images/palette.png)

## Install

`yarn add tonality`

`npm install tonality --save`

```html
<script src="https://unpkg.com/purpose/dist/tonality.js"></script>
(UMD library exposed as `Tonality`)
```

## Example Usage

```js
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
```

## Running Locally

clone repo

`git clone git@github.com:souporserious/tonality.git`

move into folder

`cd ~/tonality`

install dependencies

`yarn`

run dev mode

`yarn dev`

open your browser and visit: `http://localhost:8080/`
