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
  }

  componentWillMount() {
    this.recorder = new Recorder()
    this.recorder.onAudioBufferCaptured = (buffer: AudioBuffer) => {
      this.captureAudioBuffer(buffer)
    }
  }

  componentDidMount() {
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
            loopStart: 0,
            loopEnd: decodedBuffer.duration,
            offset: 0,
          })
        })
      })
    })
  }

  setSampleEdit(sampleId: string) {
    const { samples } = this.props
    const sample = samples[sampleId]
    if (sample) {
      console.log('setSampleEdit', sample)
      const sampler = new PlaybackSampler(sample)
      sampler.play()
      this.setState({ recordedSample: sample })
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
    const loopStart = 0
    const loopEnd = buffer.duration
    const sample: Sample = {
      id: `sample_${index}`,
      name: `recorded #${index}`,
      buffer: normalized,
      loopStart,
      loopEnd,
      offset: 0,
    }
    this.setState({ recordedSample: sample })
    this.props.storeSample(sample)
  }

  stopRecording() {
    this.recorder.stopRecording()
    this.recorder.destroy()
    this.setState({ recording: false })
  }

  renderSliders() {
    const { recordedSample } = this.state
    if (!recordedSample) {
      return null
    }

    const offset = recordedSample.offset
    const start = recordedSample.loopStart
    const end = recordedSample.loopEnd
    const step = recordedSample.buffer.duration / 1000

    return (<div>
      <Slider
        sliderStyle={sliderStyle}
        max={recordedSample.buffer.duration}
        min={0}
        step={step}
        value={start}
        onChange={(e, v) => {
          const newStart = v > end ? end : v
          this.setTrim(offset, newStart, end)
        }}
      />
      <Slider
        sliderStyle={sliderStyle}
        max={recordedSample.buffer.duration}
        min={0}
        step={step}
        value={end}
        onChange={(e, v) => {
          const newEnd = v < start ? start : v
          this.setTrim(offset, start, newEnd)
        }}
      />
    </div>)
  }

  setTrim(offset: number, loopStart: number, loopEnd: number) {
    console.log(`setTrim: ${offset}, ${loopStart}, ${loopEnd}`)
    const { recordedSample } = this.state
    const newSample = { ...recordedSample, loopStart, loopEnd, offset }
    this.setState({ recordedSample: newSample })
    this.props.storeSample(newSample)
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
          this.setSampleEdit(sampleId)
        }}
      >
        {sampleList}
      </SelectField>
      {recordButton}
      {recordedSample ? (<div style={{ width: 600 }}>
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
