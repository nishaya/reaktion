// @flow

import type { Steps, Step } from 'types/step'

const kick: Step = { position: 0, note: 0, velocity: 100 }
const chh: Step = { position: 0, note: 6, velocity: 100 }

export const basicBeats: Steps = {
  length: 16,
  list: [
    { ...kick, position: 0 },
    { ...chh, position: 2 },
    { ...kick, position: 4 },
    { ...chh, position: 6 },
    { ...kick, position: 8 },
    { ...chh, position: 10 },
    { ...kick, position: 12 },
    { ...chh, position: 14 },
  ],
}

export default {
  basicBeats,
}
