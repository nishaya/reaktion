// @flow

export type Step = {
  position: number,
  note: number,
  velocity: number,
  duration: number,
  trackId?: string,
}
export type Steps = {
  length: number,
  list: Array<Step>,
}
