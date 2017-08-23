// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import type { SynthParams, SynthType, DrumType, DrumPreset } from 'types/synth'
import type { Sample } from 'types/sampler'
import { DropDownMenu, MenuItem } from 'material-ui'
import SampleSelect from './sample_select'

type State = SynthParams & {
  sampleList: { [string]: string },
  drumList: { [DrumType]: string },
}

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
    drumList: {},
  }

  componentWillReceiveProps(nextProps: Props, nextContext) {
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

  updateSampleList(samples: { [string]: Sample }) {
    const sampleList = Object.keys(samples).reduce((prev, id) => (
      { ...prev, [id]: samples[id].name }
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
    const { sampleList, drumList } = this.state
    console.log(drumList)
    return (<div>
      <h3>drums control</h3>
      snare: <SampleSelect
        value={drumList.snare}
        sampleList={sampleList}
        onChange={(sampleId) => {
          this.selectDrumSample('snare', sampleId)
        }}
      /><br />
      cymbal: <SampleSelect
        value={drumList.cymbal}
        sampleList={sampleList}
        onChange={(sampleId) => {
          this.selectDrumSample('cymbal', sampleId)
        }}
      /><br />
    </div>)
  }

  selectDrumSample(type: DrumType, sampleId: string) {
    const sample = this.context.samples[sampleId]
    const { drumList } = this.state
    this.setState({ drumList: { ...drumList, [type]: sampleId } })
    console.log('sample selected', sampleId, sample)
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
