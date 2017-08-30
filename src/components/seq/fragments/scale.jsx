// @flow

import React, { Component } from 'react'
import { MenuItem, SelectField } from 'material-ui'
import type { Steps } from 'types/step'
import { roots, scales } from 'utils/music'
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
  notes: Array<number>,
}

const rootOptions = roots.map((r, i) => <MenuItem key={`root_${r}`} value={i} primaryText={r} />)

const scaleNotes = scales.major

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
    notes: scaleNotes,
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
    const notes = scaleNotes.map(n => (root + n) % 12).sort((a, b) => a - b)
    this.setState({ root, notes }, () => {
      this.transform(this.props.steps)
    })
  }

  props: Props

  transform(steps: Steps) {
    const { notes } = this.state
    const cnotes = [...notes].concat(notes.map(n => n + 12))
    const list = steps.list.map((s) => {
      let note = s.note
      const m = note % 12
      const adj = cnotes.find(rn => rn >= m) || 0
      note = Math.floor(note / 12) * 12 + m + (m - adj)
      // console.log(`${note2name(s.note)}(${s.note}) => ${note2name(note)}(${note})`, m, adj)
      return {
        ...s,
        note,
      }
    })
    const newSteps = { ...steps, list }
    this.props.onChange(newSteps)
    this.setState({ steps: newSteps })
  }

  render() {
    const { steps, root } = this.state
    return (<Box theme={{ bgColor: '#81D4FA' }}>
      <div className="control">
        <h2>{icon('scale')}<span className="text">scale</span></h2>
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
