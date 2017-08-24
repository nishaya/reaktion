// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import type { SynthType, DrumType, DrumPreset, SynthPreset } from 'types/synth'
import type { Sample } from 'types/sampler'
import { DropDownMenu, MenuItem, Paper, Toggle } from 'material-ui'
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

// const preloadDrums: Array<DrumType> = ['snare', 'cymbal']

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
    synthPreset: { type: 'osc', waveform: 'square' },
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
      console.log('LOAD SAMPLE', preloadSample, samples)
      const selectedSample = samples[preloadSample]
      if (selectedSample) {
        this.changeSynthPreset({ type: 'sample', sample: selectedSample })
      }
    }

    this.setState({ sampleList })
  }

  renderSynthControl(synthPreset: SynthPreset) {
    const { synthEditType } = this.state
    let control = null
    const toggle = (<Toggle
      toggled={synthEditType === 'osc'}
      onToggle={(ev: any, checked: boolean) => {
        this.setState({ synthEditType: checked ? 'osc' : 'sample' })
      }}
    />)
    if (synthEditType === 'osc') {
      const { waveform } = synthPreset
      control = (<div>
        <h4>synth control(osc)</h4>
        {toggle}<br />
        Waveform: <DropDownMenu
          value={waveform}
          onChange={(ev, key, value) => {
            this.changeSynthPreset({ ...synthPreset, waveform: value })
          }}
        >
          <MenuItem key="w1" value="square" primaryText="Square" />
          <MenuItem key="w2" value="sawtooth" primaryText="Sawtooth" />
          <MenuItem key="w3" value="sine" primaryText="Sine" />
          <MenuItem key="w4" value="triangle" primaryText="Triangle" />
        </DropDownMenu>
      </div>)
    } else if (synthEditType === 'sample') {
      const { sampleList } = this.state
      const { samples } = this.context
      const { sample } = synthPreset
      control = (<div>
        <h4>synth control(sample)</h4>
        {toggle}<br />
        Sample: <SampleSelect
          selected={sample ? sample.id : null}
          sampleList={sampleList}
          onChange={(sampleId) => {
            const selectedSample = samples[sampleId]
            this.changeSynthPreset({ type: 'sample', sample: selectedSample })
          }}
        />
      </div>)
    }

    return <div>{control}</div>
  }

  renderDrumsControl() {
    const { sampleList, drumList } = this.state
    console.log(drumList)
    return (<div>
      <h4>drums control</h4>
      snare: <SampleSelect
        selected={drumList.snare}
        sampleList={sampleList}
        onChange={(sampleId) => {
          this.selectDrumSample('snare', sampleId, this.context.samples)
        }}
      /><br />
      cymbal: <SampleSelect
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
    const { synthPreset } = this.state
    const { synthType } = this.props
    return (<Paper style={{ padding: 8 }}>
      {synthType === 'drums' ? this.renderDrumsControl()
        : this.renderSynthControl(synthPreset)}
    </Paper>)
  }
}
