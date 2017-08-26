// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import type { SynthType, DrumType, DrumPreset, SynthPreset } from 'types/synth'
import type { Sample } from 'types/sampler'
import { MenuItem, Paper, Toggle, SelectField } from 'material-ui'
import SampleSelect from './sample_select'

type Samples = { [string]: Sample }
type Context = {
  samples: Samples,
}

type SynthPresetType = 'osc' | 'sample'
type State = {
  sampleList: { [string]: string },
  drumList: { [DrumType]: string },
  synthPreset: SynthPreset,
  synthEditType: SynthPresetType,
}

type Props = {
  synthType: SynthType,
  onPresetChanged: (synthPreset: SynthPreset) => any,
  setDrum: (type: DrumType, preset: DrumPreset) => any,
  preloadDrums: Array<DrumType>,
  preloadSample: ?string,
}

export default class SynthControl extends Component {
  static contextTypes = {
    samples: PropTypes.shape(),
  }
  static defaultProps = {
    setDrum: (type, sample) => console.log('setDrum', type, sample),
    preloadDrums: [],
    preloadSample: null,
  }
  props: Props
  state: State = {
    sampleList: {},
    drumList: {},
    synthPreset: { type: 'osc', waveform: 'square', sample: null },
    synthEditType: 'osc',
  }

  componentWillReceiveProps(nextProps: Props, nextContext: ?Context) {
    if (nextContext && nextContext.samples !== this.context.samples) {
      this.updateSampleList(nextContext.samples)
    }
  }

  componentWillMount() {
    this.updateSampleList(this.context.samples)
    const { synthPreset } = this.state
    const { synthType } = this.props
    if (synthType === 'synth') {
      this.props.onPresetChanged(synthPreset)
    }
  }

  changeSynthPreset(synthPreset: SynthPreset) {
    this.setState({ synthPreset, synthEditType: synthPreset.type })
    this.props.onPresetChanged(synthPreset)
  }

  updateSampleList(samples: Samples) {
    const sampleList = Object.keys(samples).reduce((prev, id) => (
      { ...prev, [id]: samples[id].name }
    ), {})

    const { preloadDrums, preloadSample } = this.props
    const { drumList, synthPreset } = this.state
    preloadDrums.forEach((type) => {
      const id = `sample_${type}`
      if (!drumList[type] && sampleList[id]) {
        this.selectDrumSample(type, id, samples)
      }
    })

    if (preloadSample && synthPreset.type !== 'sample') {
      const selectedSample = samples[preloadSample]
      if (selectedSample) {
        this.changeSynthPreset({ ...synthPreset, type: 'sample', sample: selectedSample })
      }
    }

    this.setState({ sampleList })
  }

  renderSynthControl(synthPreset: SynthPreset) {
    const { synthEditType } = this.state
    let control = null
    const toggle = (<div style={{ maxWidth: 200 }}>
      <Toggle
        label={`Synth type: ${synthEditType}`}
        toggled={synthEditType === 'osc'}
        onToggle={(ev: any, checked: boolean) => {
          this.setState({ synthEditType: checked ? 'osc' : 'sample' })
        }}
      />
    </div>)
    if (synthEditType === 'osc') {
      const { waveform } = synthPreset
      control = (<div>
        {toggle}<br />
        <SelectField
          floatingLabelText="Waveform"
          value={waveform}
          onChange={(ev, key, value) => {
            this.changeSynthPreset({ type: 'osc', waveform: value, sample: null })
          }}
        >
          <MenuItem key="w1" value="square" primaryText="Square" />
          <MenuItem key="w2" value="sawtooth" primaryText="Sawtooth" />
          <MenuItem key="w3" value="sine" primaryText="Sine" />
          <MenuItem key="w4" value="triangle" primaryText="Triangle" />
        </SelectField>
      </div>)
    } else if (synthEditType === 'sample') {
      const { sampleList } = this.state
      const { samples } = this.context
      const { sample } = synthPreset
      control = (<div>
        {toggle}<br />
        <SampleSelect
          label="sample"
          selected={sample ? sample.id : null}
          sampleList={sampleList}
          onChange={(sampleId) => {
            const selectedSample = samples[sampleId]
            this.changeSynthPreset({ ...synthPreset, ype: 'sample', sample: selectedSample })
          }}
        />
      </div>)
    }

    return <div>{control}</div>
  }

  renderDrumsControl() {
    const { sampleList, drumList } = this.state
    return (<div>
      <SampleSelect
        label="snare"
        selected={drumList.snare}
        sampleList={sampleList}
        onChange={(sampleId) => {
          this.selectDrumSample('snare', sampleId, this.context.samples)
        }}
      /><br />
      <SampleSelect
        label="cymbal"
        selected={drumList.cymbal}
        sampleList={sampleList}
        onChange={(sampleId) => {
          this.selectDrumSample('cymbal', sampleId, this.context.samples)
        }}
      /><br />
    </div>)
  }

  selectDrumSample(type: DrumType, sampleId: string, samples: Samples) {
    const sample = samples[sampleId]
    const { drumList } = this.state
    this.setState({ drumList: { ...drumList, [type]: sampleId } })
    this.props.setDrum(
      type,
      {
        type: 'sample',
        sample,
      },
    )
  }

  render() {
    const { synthPreset } = this.state
    const { synthType } = this.props
    return (<Paper style={{ padding: 8 }}>
      {synthType === 'drums' ? this.renderDrumsControl()
        : this.renderSynthControl(synthPreset)}
    </Paper>)
  }
}
