// @flow

import type { Steps, Step } from 'types/step'

const base: Step = { position: 0, velocity: 100, note: 0, duration: 6.0 }

export const basicPad: Steps = {
  length: 8,
  list: [
    { ...base, note: 60 },
    { ...base, note: 65 },
    { ...base, note: 70 },
  ],
}

export default {
  basicPad,
}
