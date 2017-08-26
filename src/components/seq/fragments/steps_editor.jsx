// @flow

import React, { Component } from 'react'
import { Dialog } from 'material-ui'
import type { Steps } from 'types/step'
import { roots } from 'utils/music'

type Props = {
  show: boolean,
  steps: Steps,
  onEdit: (newSteps: Steps) => any,
  onRequestClose: () => void,
  drums: boolean,
}

type State = {
  editNotes: Array<number>,
}

const checkBoxStyle = {
  border: '2px solid #ccc',
  display: 'inline-block',
  width: 20,
  height: 20,
  padding: 0,
  margin: 1,
  marginBottom: 0,
}
const checkedStyle = { ...checkBoxStyle, backgroundColor: '#999' }

const drumLabels: Array<{ note: number, name: string }> = [
  { note: 0, name: 'kick' },
  { note: 2, name: 'snare' },
  { note: 6, name: 'chh' },
  { note: 10, name: 'ohh' },
  { note: 1, name: 'cymbal' },
]

const labelStyle = { width: 60, display: 'inline-block', textAlign: 'right', paddingRight: 4, verticalAlign: '30%' }

export default class StepEdit extends Component {
  static defaultProps = {
    show: false,
    steps: [],
    onEdit: (newSteps: Steps) => console.log(newSteps),
    onRequestClose: () => {},
    drums: false,
  }

  componentWillMount() {
    if (this.props.drums) {
      this.setState({ editNotes: [0, 2, 6, 10, 1] })
    }
  }

  props: Props
  state: State = {
    editNotes: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71],
  }

  checkStep(position: number, note: number, checked: boolean) {
    const { onEdit, steps } = this.props
    if (checked) {
      const newSteps = steps.list.slice(0)
      newSteps.push({
        note,
        position,
        velocity: 100,
        duration: 1.0,
      })
      onEdit({ ...steps, list: newSteps })
    } else {
      const newSteps = steps.list.filter(s => s.position !== position || s.note !== note)
      onEdit({ ...steps, list: newSteps })
    }
  }

  render() {
    const { show, steps, onRequestClose, drums } = this.props
    const { editNotes } = this.state
    const checkWidth = Math.ceil(400 / steps.length)
    return (<div>
      <Dialog
        open={show}
        onRequestClose={onRequestClose}
        title="edit steps"
      >
        <div style={{ width: '600px' }}>
          {editNotes.map((en) => {
            const boxes = new Array(steps.length).fill(null).map((x, index) => {
              const step = steps.list.find(s => s.position === index && s.note === en)
              const checked = step !== undefined && step.note === en
              const style = { ...(checked ? checkedStyle : checkBoxStyle), width: checkWidth }
              const key = `e_${en}_${index}`
              return (<checkbox
                key={key}
                style={style}
                onClick={() => {
                  this.checkStep(index, en, !checked)
                }}
              />)
            })
            // boxes.push(<br />)
            let label = roots[en % 12]
            if (drums) {
              const drumLabel = drumLabels.find(dl => dl.note === en % 12)
              if (drumLabel) {
                label = drumLabel.name
              }
            }
            return [(<div style={labelStyle}>{label}</div>), ...boxes, (<br />)]
          }).reverse()}
        </div>
      </Dialog>
    </div>)
  }
}
