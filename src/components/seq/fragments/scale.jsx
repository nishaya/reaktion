// @flow

import React, { Component } from 'react'
import { MenuItem, SelectField } from 'material-ui'
import type { Steps } from 'types/step'
import { roots } from 'utils/music'
import Box from './box'
import StepsPreview from './steps_preview'
import { icon } from './icon'
import { initSteps } from './steps_generator'

type Props = {
  steps: Steps,
  onChange: (steps: Steps) => any,
  count: number,
  scale: number,
}

type State = {
  count: number,
  steps: Steps,
}

const rootOptions = roots.map((r, i) => <MenuItem key={`root_${r}`} value={i} primaryText={r} />)

export default class Scale extends Component<any, Props, State> {
  static defaultProps = {
    count: 1,
    scale: 0,
    steps: initSteps(0),
  }

  state: State = {
    count: 1,
    steps: initSteps(0),
  }

  componentDidMount() {
    this.setScale(this.props.scale)
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.steps !== this.props.steps) {
      this.transform(nextProps.steps)
    }
  }

  setScale(scale: number) {
    this.setState({ scale }, () => {
      this.transform(this.props.steps)
    })
  }

  props: Props

  transform(steps: Steps) {
    const { count } = this.state
    const list = steps.list.map(s => ({
      ...s,
      position: s.position * count,
      duration: s.duration * count,
    }))
    const newSteps = { length: count * steps.length, list }
    this.props.onChange(newSteps)
    this.setState({ steps: newSteps })
  }

  render() {
    const { steps, scale } = this.state
    return (<Box theme={{ bgColor: '#B39DDB' }}>
      <div className="control">
        <h2>{icon('scale')}scale</h2>
        <SelectField
          style={{ width: 100 }}
          value={scale}
        >
          {rootOptions}
        </SelectField>
      </div>
      <StepsPreview steps={steps} />
    </Box>)
  }
}
