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
  root: number,
}

type State = {
  count: number,
  steps: Steps,
  root: number,
}

const rootOptions = roots.map((r, i) => <MenuItem key={`root_${r}`} value={i} primaryText={r} />)

export default class Scale extends Component<any, Props, State> {
  static defaultProps = {
    count: 1,
    root: 0,
    steps: initSteps(0),
  }

  state: State = {
    root: 0,
    count: 1,
    steps: initSteps(0),
  }

  componentDidMount() {
    console.log(this.props)
    this.setScale(this.props.root)
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.steps !== this.props.steps) {
      this.transform(nextProps.steps)
    }
  }

  setScale(root: number) {
    this.setState({ root }, () => {
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
    const { steps, root } = this.state
    return (<Box theme={{ bgColor: '#B39DDB' }}>
      <div className="control">
        <h2>{icon('scale')}scale</h2>
        <SelectField
          style={{ width: 100 }}
          value={root}
          onChange={(ev, v) => {
            this.setScale(v)
          }}
        >
          {rootOptions}
        </SelectField>
      </div>
      <StepsPreview steps={steps} />
    </Box>)
  }
}
