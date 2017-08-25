// @flow

import React, { Component } from 'react'
import { Dialog, Checkbox } from 'material-ui'
import type { Steps } from 'types/step'

type Props = {
  show: boolean,
  steps: Steps,
  onEdit: (newSteps: Steps) => any,
  onRequestClose: () => void,
}

type State = {
  editNotes: Array<number>,
}

export default class StepEdit extends Component {
  static defaultProps = {
    show: false,
    steps: [],
    onEdit: (newSteps: Steps) => console.log(newSteps),
    onRequestClose: () => {},
  }

  props: Props
  state: State = {
    editNotes: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71],
  }

  checkStep(position: number, note: number, checked: boolean) {
    console.log('checkStep', position, note, checked)
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
      console.log(newSteps)
      onEdit({ ...steps, list: newSteps })
    }
  }

  render() {
    const { show, steps, onRequestClose } = this.props
    const { editNotes } = this.state
    return (<div>
      <Dialog
        open={show}
        onRequestClose={onRequestClose}
        title="edit steps"
      >
        <div style={{ width: '500px' }}>
          {editNotes.map((en) => {
            return new Array(steps.length).fill(null).map((x, index) => {
              const step = steps.list.find(s => s.position === index)
              const checked = step !== undefined
              const key = `e_${index}`
              return (<Checkbox
                key={key}
                style={{ padding: 0, margin: 0, width: 30 }}
                checked={checked}
                onCheck={(e, v) => {
                  this.checkStep(index, 60, v)
                }}
              />)
            })
          })}
        </div>
      </Dialog>
    </div>)
  }
}
