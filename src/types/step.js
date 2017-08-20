// @flow

export type Step = {
  position: number,
  note: number,
  velocity: number,
}
export type Steps = {
  length: number,
  list: Array<Step>,
}
