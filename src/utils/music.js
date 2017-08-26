// @flow

export const roots = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
]

export const majorScale = [0, 2, 4, 5, 7, 9, 11]

export const note2name = (note: number):string => {
  const m = note % 12
  const o = Math.floor(note / 12) - 2
  return `${roots[m]}${o}`
}

export default {}
