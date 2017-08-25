// @flow

import type { Steps, Step } from 'types/step'

const base: Step = { position: 0, velocity: 100, note: 0, duration: 2 }

export const basicPad: Steps = {
  length: 8,
  list: [
    { ...base, note: 60, position: 2 },
    { ...base, note: 65, position: 2 },
    { ...base, note: 70, position: 2 },
    { ...base, note: 60, position: 5 },
    { ...base, note: 65, position: 5 },
    { ...base, note: 70, position: 5 },
  ],
}

export default {
  basicPad,
}
