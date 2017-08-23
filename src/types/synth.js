// @flow

export type Tone = {
  note: number,
  offset?: number,
  duration?: number,
  velocity?: number,
  trackId?: string,
}

export type PlaybackOptions = {
  offset?: number,
  when?: number,
  loop?: boolean,
}
