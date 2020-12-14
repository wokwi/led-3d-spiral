/**
 * 3D LED Spiral
 *
 * Copyright (c) 2020 Uri Shaked
 *
 * Released under the MIT license.
 */

const root = document.getElementById('led-spiral');
const pixels = [];

const urlParams = new URL(location.href).searchParams;

function clamp(n, min, max) {
  return n < min ? min : n > max ? max : n;
}

const numLeds = clamp(parseInt(urlParams.get('leds'), 10), 0, 1024) || 128;
const c = clamp(parseFloat(urlParams.get('c')), 0.1, 64) || 10;
const r = clamp(parseFloat(urlParams.get('r')), 0.1, 16) || 1;
const spirals = clamp(parseFloat(urlParams.get('spirals')), 1, 16) || 1;
let pixelIndex = 0;
for (let spiralIndex = 0; spiralIndex < spirals; spiralIndex++) {
  const spiral = document.createElement('a-entity');
  root.appendChild(spiral);
  spiral.setAttribute('rotation', { z: (360 / spirals) * spiralIndex });
  for (let index = 0; index < numLeds; index++) {
    const theta = Math.acos(index / (numLeds / 2) - 1);
    const x = r * Math.sin(theta) * Math.cos(c * theta);
    const y = r * Math.sin(theta) * Math.sin(c * theta);
    const z = r * Math.cos(theta);
    const led = document.createElement('a-led');
    led.setAttribute('position', { x, y, z });
    spiral.appendChild(led);
    pixels[pixelIndex++] = led;
  }
}

parent.postMessage({ app: 'wokwi', command: 'listen', version: 1 }, 'https://wokwi.com');

window.addEventListener('message', ({ data }) => {
  if (data.neopixels) {
    const { neopixels } = data;
    for (let i = 0; i < neopixels.length; i++) {
      const value = neopixels[i];
      const b = value & 0xff;
      const r = (value >> 8) & 0xff;
      const g = (value >> 16) & 0xff;
      if (pixels[i]) {
        pixels[i].setAttribute('color', `rgb(${r}, ${g}, ${b})`);
      }
    }
  }
});

const spinButton = document.getElementById('option-spin');
spinButton.addEventListener('change', () => {
  if (spinButton.checked) {
    root.components.animation.play();
  } else {
    root.components.animation.pause();
  }
});
