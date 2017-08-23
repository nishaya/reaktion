// @flow

import React, { Component } from 'react'
import Box from 'components/seq/fragments/box'
import type { Sample } from 'types/sampler'

const PreviewBox = Box.extend`
  width: 300px;
  margin: 0px;
`

const WIDTH = 300
const HEIGHT = 64

type Props = {
  sample: ?Sample,
}

export default class SamplePreview extends Component {
  static defaultProps: Props = {
    buffer: null,
  }
  componentDidMount() {
    this.renderPreview(this.props.sample)
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.sample !== this.props.sample) {
      this.renderPreview(nextProps.sample)
    }
  }

  canvas: any
  props: Props

  renderPreview(sample: ?Sample) {
    console.log('renderPreview', sample)
    if (!sample) {
      return
    }
    const { buffer } = sample
    const samples = buffer.getChannelData(0)
    console.log('len', samples.length)

    const ctx = this.canvas.getContext('2d')
    const samplesPerPixel = samples.length / WIDTH
    ctx.imageSmoothingEnabled = false
    ctx.fillStyle = 'rgb(203, 213, 198)'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
    ctx.strokeStyle = 'rgb(98, 104, 95)'
    ctx.lineWidth = 1
    const halfHeight = HEIGHT / 2
    for (let i = 0; i < WIDTH; i += 1) {
      const s = samples[Math.floor(samplesPerPixel * i)]
      const top = Math.ceil(halfHeight + s * halfHeight)
      ctx.beginPath()
      ctx.moveTo(i, top)
      ctx.lineTo(i + 1, top)
      ctx.stroke()
    }
  }

  render() {
    const { sample } = this.props
    return (<PreviewBox theme={{ bgColor: '#fafafa' }}>
      length: {sample ? sample.buffer.length : '-'}<br />
      <canvas
        ref={(canvas) => { this.canvas = canvas }}
        width={WIDTH}
        height={HEIGHT}
      />
    </PreviewBox>)
  }
}
