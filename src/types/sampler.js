// @flow

export type Sample = {
  buffer: AudioBuffer,
  id: string,
  name: string,
  loopStart: number,
  loopEnd: number,
  offset: number,
  loop: boolean,
  transpose: number,
}
