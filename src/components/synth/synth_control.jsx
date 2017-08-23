// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import type { SynthParams, SynthType, DrumsMap, DrumType, DrumPreset } from 'types/synth'
import { DropDownMenu, MenuItem } from 'material-ui'
import SampleSelect from './sample_select'

type State = SynthParams & { drums: DrumsMap } & { sampleList: { [string]: string } }

type Props = {
  synthType: SynthType,
  onControlChanged: (synthParams: SynthParams) => any,
  setDrum: (type: DrumType, preset: DrumPreset) => any,
}

export default class SynthControl extends Component {
  static contextTypes = {
    samples: PropTypes.shape(),
  }
  static defaultProps = {
    setDrum: (type, sample) => console.log('setDrum', type, sample),
  }
  props: Props
  state: State = {
    waveform: 'sine',
    sampleList: {},
    drums: {
      kick: {
        type: 'synth',
      },
      chh: {
        type: 'synth',
      },
      ohh: {
        type: 'synth',
      },
      snare: {
        type: 'synth',
      },
      cymbal: {
        type: 'synth',
      },
    },
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext.samples !== this.context.samples) {
      console.log('CONTEXT UPDATED', nextContext.samples)
      this.updateSampleList(nextContext.samples)
    }
  }

  componentWillMount() {
    const { waveform } = this.state
    console.log('CONTEXT INIT', this.context)
    this.updateSampleList(this.context.samples)
    this.props.onControlChanged({ waveform })
  }

  changeControlParams(controlParams: SynthParams) {
    this.setState(controlParams)
    this.props.onControlChanged(controlParams)
  }

  updateSampleList(samples) {
    const sampleList = Object.values(samples).reduce((prev, s) => (
      { ...prev, [s.id]: s.name }
    ), {})

    this.setState({ sampleList })
  }

  renderSynthControl(params: SynthParams) {
    const { waveform } = params
    return (<div>
      Waveform: <DropDownMenu
        value={waveform}
        onChange={(ev, key, value) => {
          this.changeControlParams({ ...params, waveform: value })
        }}
      >
        <MenuItem key="w1" value="square" primaryText="Square" />
        <MenuItem key="w2" value="sawtooth" primaryText="Sawtooth" />
        <MenuItem key="w3" value="sine" primaryText="Sine" />
        <MenuItem key="w4" value="triangle" primaryText="Triangle" />
      </DropDownMenu>
    </div>)
  }

  renderDrumsControl() {
    const { sampleList } = this.state
    return (<div>
      <h3>drums control</h3>
      snare: <SampleSelect
        sampleList={sampleList}
        onChange={(sampleId) => {
          this.selectDrumSample('snare', sampleId)
        }}
      /><br />
      cymbal: <SampleSelect
        sampleList={sampleList}
        onChange={(sampleId) => {
          this.selectDrumSample('cymbal', sampleId)
        }}
      /><br />
    </div>)
  }

  selectDrumSample(type: DrumType, sampleId: string) {
    const sample = this.context.samples[sampleId]
    console.log('sample selected', sample)
    this.props.setDrum(
      type,
      {
        type: 'sample',
        sample,
      },
    )
  }

  render() {
    const { waveform } = this.state
    const { synthType } = this.props
    const params = { waveform }
    return (<div>
      <div>simple synth control ({synthType})</div>
      {synthType === 'drums' ? this.renderDrumsControl()
        : this.renderSynthControl(params)}
    </div>)
  }
}
