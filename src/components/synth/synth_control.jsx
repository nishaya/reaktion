// @flow

import React, { Component } from 'react'
import type { SynthParams, SynthType, DrumsMap } from 'types/synth'
import { DropDownMenu, MenuItem } from 'material-ui'

type State = SynthParams & { drums: DrumsMap }

type Props = {
  synthType: SynthType,
  onControlChanged: (synthParams: SynthParams) => any,
}

export default class SynthControl extends Component {
  props: Props
  state: State = {
    waveform: 'sine',
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

  componentWillMount() {
    const { waveform } = this.state
    this.props.onControlChanged({ waveform })
  }

  changeControlParams(controlParams: SynthParams) {
    this.setState(controlParams)
    this.props.onControlChanged(controlParams)
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
      </DropDownMenu>
    </div>)
  }

  renderDrumsControl(params: SynthParams) {
    return (<div>
      drums control
    </div>)
  }

  render() {
    const { waveform } = this.state
    const { synthType } = this.props
    const params = { waveform }
    return (<div>
      <div>simple synth control ({synthType})</div>
      {synthType === 'drums' ? this.renderDrumsControl(params)
        : this.renderSynthControl(params)}
    </div>)
  }
}
