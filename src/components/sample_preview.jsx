// @flow

import React, { Component } from 'react'
import Box from 'components/seq/fragments/box'

const PreviewBox = Box.extend`
  width: 300px;
  margin: 0px;
`

const WIDTH = 300
const HEIGHT = 64

type Props = {
  buffer: ?AudioBuffer,
}

export default class SamplePreview extends Component {
  static defaultProps: Props = {
    buffer: null,
  }
  componentDidMount() {
    this.renderPreview(this.props.buffer)
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.buffer !== this.props.buffer) {
      this.renderPreview(nextProps.buffer)
    }
  }

  canvas: any
  props: Props

  renderPreview(buffer: ?AudioBuffer) {
    if (!buffer) {
      return
    }
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
      const sample = samples[Math.floor(samplesPerPixel * i)]
      const top = Math.ceil(halfHeight + sample * halfHeight)
      ctx.beginPath()
      ctx.moveTo(i, top)
      ctx.lineTo(i + 1, top)
      ctx.stroke()
    }
  }

  render() {
    const { buffer } = this.props
    return (<PreviewBox theme={{ bgColor: '#fafafa' }}>
      length: {buffer ? buffer.length : '-'}<br />
      <canvas
        ref={(canvas) => { this.canvas = canvas }}
        width={WIDTH}
        height={HEIGHT}
      />
    </PreviewBox>)
  }
}
