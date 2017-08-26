// @flow

import type { Steps, Step } from 'types/step'

const base = { position: 0, velocity: 100, note: 0, duration: 1.0 }
const kick: Step = { ...base, note: 0 }
const cymbal: Step = { ...base, note: 1 }
const chh: Step = { ...base, note: 6 }
const ohh: Step = { ...base, note: 10 }
const snare: Step = { ...base, note: 2 }

export const basicBeats: Steps = {
  length: 16,
  list: [
    { ...kick, position: 0 },
    { ...cymbal, position: 0 },
    { ...chh, position: 0 },
    { ...ohh, position: 2 },
    { ...kick, position: 4 },
    { ...snare, position: 4 },
    { ...chh, position: 4 },
    { ...ohh, position: 6 },
    { ...kick, position: 8 },
    { ...chh, position: 8 },
    { ...ohh, position: 10 },
    { ...kick, position: 12 },
    { ...chh, position: 12 },
    { ...snare, position: 12 },
    { ...ohh, position: 14 },
  ],
}

export default {
  basicBeats,
}
