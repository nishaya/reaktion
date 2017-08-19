// @flow

export default class BasePreset {
  volume: number = 100

  export(): Object {
    const { volume } = this
    return {
      type: 'base',
      volume,
    }
  }
}
