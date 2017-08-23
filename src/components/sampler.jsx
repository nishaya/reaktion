// @flow

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SampleActions from 'actions/sample'
import Rack from 'components/common/rack'
import type { Sample } from 'types/sampler'
import { MenuItem, SelectField, RaisedButton, Slider } from 'material-ui'
import PlaybackSampler from 'synth/playback_sampler'
import Recorder from 'synth/recorder'
import { generateWhiteNoise } from 'synth/gen/noise'
import SamplePreview from 'components/sampler/sample_preview'
import { sliderStyle } from 'components/common/styles'
import ABU from 'audio-buffer-utils'

const ctx: AudioContext = new window.AudioContext()

type Props = {
  storeSample: (sample: Sample) => any,
  samples: { [string]: Sample },
}

type State = {
  sampleList: Array<MenuItem>,
  recording: boolean,
  recordedSample: ?Sample,
  loopStart: number,
  loopEnd: number,
}

const sampleFiles = [
  'snare',
  'cymbal',
  'str',
]

class SamplerComponent extends Component {
  recorder: Recorder

  state: State = {
    sampleList: [],
    recording: false,
    recordedSample: null,
    loopStart: 0,
    loopEnd: 0,
  }

  componentWillMount() {
    this.recorder = new Recorder()
    this.recorder.onAudioBufferCaptured = (buffer: AudioBuffer) => {
      this.captureAudioBuffer(buffer)
    }
  }

  componentDidMount() {
    for (let i = 0; i < 3; i += 1) {
      this.props.storeSample({
        id: `sample_${i}`,
        name: `noise #${i}`,
        buffer: generateWhiteNoise(ctx),
        start: 0,
        end: (i + 1) * 0.2,
      })
    }
    sampleFiles.forEach(file => this.loadSampleFile(`./samples/${file}.webm`, file, file))
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.samples !== this.props.samples) {
      const { samples } = nextProps
      const sampleList = Object.keys(samples).map(sampleId => (
        <MenuItem key={sampleId} value={sampleId} primaryText={samples[sampleId].name} />
      ))
      this.setState({ sampleList })
    }
  }

  props: Props

  loadSampleFile(fileUrl: string, id: string, name: string) {
    const request = new Request(fileUrl)
    fetch(request).then((res) => {
      res.arrayBuffer().then((arrayBuffer) => {
        ctx.decodeAudioData(arrayBuffer).then((decodedBuffer) => {
          console.log('decoded', decodedBuffer)
          this.props.storeSample({
            id: `sample_${name}`,
            name,
            buffer: decodedBuffer,
            start: 0,
            end: decodedBuffer.duration,
          })
        })
      })
    })
  }

  playback(sampleId: string) {
    const { samples } = this.props
    const sample = samples[sampleId]
    if (sample) {
      console.log('playback', sample)
      const sampler = new PlaybackSampler(sample)
      sampler.play({ duration: 3.0 })
    }
  }

  startRecording() {
    this.recorder.prepare()
    this.setState({ recording: true })
  }

  captureAudioBuffer(buffer: AudioBuffer) {
    console.log('captureAudioBuffer', buffer)
    const normalized = ABU.create(buffer.length, 1, buffer.sampleRate)
    ABU.normalize(buffer, normalized)
    console.log('normalized', normalized)
    const { sampleList } = this.state
    const index = sampleList.length
    const loopStart = buffer.duration * 0.2
    const loopEnd = buffer.duration * 0.8
    const sample: Sample = {
      id: `sample_${index}`,
      name: `recorded #${index}`,
      buffer: normalized,
      start: loopStart,
      end: loopEnd,
    }
    this.setState({ recordedSample: sample, loopStart, loopEnd })
    this.props.storeSample(sample)
  }

  stopRecording() {
    this.recorder.stopRecording()
    this.recorder.destroy()
    this.setState({ recording: false })
  }

  renderSliders() {
    const { recordedSample, loopStart, loopEnd } = this.state
    if (!recordedSample) {
      return null
    }

    return (<div>
      <Slider
        sliderStyle={sliderStyle}
        max={recordedSample.buffer.duration}
        min={0}
        step={0.005}
        value={loopStart}
        onChange={(e, v) => {
          this.setTrim(v > loopEnd ? loopEnd : v, loopEnd)
        }}
      />
      <Slider
        sliderStyle={sliderStyle}
        max={recordedSample.buffer.duration}
        min={0}
        step={0.005}
        value={loopEnd}
        onChange={(e, v) => {
          this.setTrim(loopStart, v < loopStart ? loopStart : v)
        }}
      />
    </div>)
  }

  setTrim(loopStart: number, loopEnd: number) {
    const { recordedSample } = this.state
    const newSample = { ...recordedSample, start: loopStart, end: loopEnd }
    console.log('setTrim', loopStart, loopEnd)
    this.setState({ loopStart, loopEnd, recordedSample: newSample })
  }

  render() {
    const { sampleList, recording, recordedSample } = this.state
    const recordButton = recording ? (
      <RaisedButton
        label="Stop Recording"
        onClick={() => {
          this.stopRecording()
        }}
      />
    ) : (
      <RaisedButton
        label="Start Recording"
        onClick={() => {
          this.startRecording()
        }}
      />
    )
    return (<Rack>
      <h2>sampler</h2>
      <SelectField
        hintText="please select"
        onChange={(ev: any, key: number, sampleId: string) => {
          console.log('onChange', sampleId)
          this.playback(sampleId)
        }}
      >
        {sampleList}
      </SelectField>
      {recordButton}
      {recordedSample ? (<div>
        <RaisedButton
          label="Play"
          onClick={() => {
            const sampler = new PlaybackSampler(recordedSample)
            sampler.play()
          }}
        />
        {this.renderSliders()}
        <SamplePreview sample={recordedSample} />
      </div>) : null}
    </Rack>)
  }
}

const mapStateToProps = store => ({ samples: store.sample.samples })

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...SampleActions },
  dispatch,
)

export default connect(mapStateToProps, mapDispatchToProps)(SamplerComponent)
