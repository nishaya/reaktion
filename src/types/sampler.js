// @flow

export type Sample = {
  buffer: AudioBuffer,
  id: string,
  name: string,
  offset: number,
  loop: boolean,
  loopStart: number,
  loopEnd: number,
  transpose: number,
}
