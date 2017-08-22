// @flow

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SampleActions from 'actions/sample'
import Rack from 'components/common/rack'
import type { Sample } from 'types/sampler'
import { MenuItem, SelectField, RaisedButton } from 'material-ui'
import PlaybackSampler from 'synth/playback_sampler'
import Recorder from 'synth/recorder'
import { generateWhiteNoise } from 'synth/gen/noise'

const ctx: AudioContext = new window.AudioContext()

type Props = {
  storeSample: (sample: Sample) => any,
  samples: { [string]: Sample },
}

type State = {
  sampleList: Array<MenuItem>,
  recording: boolean,
}

class SamplerComponent extends Component {
  recorder: Recorder

  state: State = {
    sampleList: [],
    recording: false,
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
      })
    }
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

  playback(sampleId: string) {
    const { samples } = this.props
    const sample = samples[sampleId]
    if (sample) {
      console.log('playback', sample)
      const sampler = new PlaybackSampler(sample.buffer)
      sampler.play()
    }
  }

  startRecording() {
    this.recorder.prepare()
    this.setState({ recording: true })
  }

  captureAudioBuffer(buffer: AudioBuffer) {
    console.log('captureAudioBuffer', buffer)
    const { sampleList } = this.state
    const index = sampleList.length
    this.props.storeSample({
      id: `sample_${index}`,
      name: `recorded #${index}`,
      buffer,
    })
  }

  stopRecording() {
    this.recorder.stopRecording()
    this.recorder.destroy()
    this.setState({ recording: false })
  }

  render() {
    const { sampleList, recording } = this.state
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
    </Rack>)
  }
}

const mapStateToProps = store => ({ samples: store.sample.samples })

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...SampleActions },
  dispatch,
)

export default connect(mapStateToProps, mapDispatchToProps)(SamplerComponent)
