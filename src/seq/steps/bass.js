// @flow

import type { Steps, Step } from 'types/step'

const base: Step = { position: 0, velocity: 100, note: 60, duration: 0.8 }

export const basicBass: Steps = {
  length: 8,
  list: [
    { ...base, position: 0 },
    { ...base, position: 2 },
    { ...base, position: 3 },
    { ...base, position: 5 },
  ],
}

export default {
  basicBass,
}
