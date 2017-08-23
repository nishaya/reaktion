// @flow

import React, { Component } from 'react'
import type { SynthParams } from 'types/synth'
import { DropDownMenu, MenuItem } from 'material-ui'

type State = SynthParams

type Props = {
  onControlChanged: (synthParams: SynthParams) => any,
}

export default class SynthControl extends Component {
  props: Props
  state: State = {
    waveform: 'sine',
  }

  componentWillMount() {
    const { waveform } = this.state
    this.props.onControlChanged({ waveform })
  }

  changeControlParams(controlParams: SynthParams) {
    this.setState(controlParams)
    this.props.onControlChanged(controlParams)
  }

  render() {
    const { waveform } = this.state
    const controlParams = { waveform }
    return (<div>
      <div>simple synth control</div>
      Waveform: <DropDownMenu
        value={waveform}
        onChange={(ev, key, value) => {
          this.changeControlParams({ ...controlParams, waveform: value })
        }}
      >
        <MenuItem key="w1" value="square" primaryText="Square" />
        <MenuItem key="w2" value="sawtooth" primaryText="Sawtooth" />
        <MenuItem key="w3" value="sine" primaryText="Sine" />
      </DropDownMenu>
    </div>)
  }
}
