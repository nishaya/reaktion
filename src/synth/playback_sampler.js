// @flow

import type { PlaybackOptions } from 'types/synth'
import { ctx } from './audio_context'

const defaultOptions: PlaybackOptions = {
  offset: 0,
  loop: false,
}

export default class PlaybackSampler {
  buffer: ArrayBuffer

  constructor(buffer: ArrayBuffer) {
    this.buffer = buffer
  }

  play(options: PlaybackOptions) {
    const { offset, loop } = { ...defaultOptions, ...options }
    const source = ctx.createBufferSource()
    const duration = 0.02
    source.buffer = this.buffer
    source.loop = loop
    source.connect(ctx.destination)
    source.start(offset)
    source.stop(offset + duration)
  }
}
