// @flow

import React, { Component } from 'react'
import { Dialog, Checkbox } from 'material-ui'
import type { Steps, Step } from 'types/step'

type Props = {
  show: boolean,
  steps: Steps,
  onEdit: (newSteps: Steps) => any,
  onRequestClose: () => void,
}

export default class StepEdit extends Component {
  static defaultProps = {
    show: false,
    steps: [],
    onEdit: (newSteps: Steps) => console.log(newSteps),
    onRequestClose: () => {},
  }

  props: Props

  render() {
    const { show, steps, onEdit, onRequestClose } = this.props
    return (<div>
      <Dialog
        open={show}
        onRequestClose={onRequestClose}
        title="edit steps"
      >
        <div style={{ width: '500px' }}>
          {new Array(steps.length).fill(null).map((x, index) => {
            const step = steps.list.find(s => s.position === index)
            const checked = step !== undefined
            const key = `e_${index}`
            return (<Checkbox
              key={key}
              style={{ padding: 0, margin: 0, width: 30 }}
              checked={checked}
              onCheck={(e, v) => {
                if (v) {
                  const newSteps = steps.list.slice(0)
                  newSteps.push({
                    note: 64,
                    position: index,
                    velocity: 100,
                    duration: 1.0,
                  })
                  onEdit({ ...steps, list: newSteps })
                } else {
                  const newSteps = steps.list.filter(s => s.position !== index)
                  onEdit({ ...steps, list: newSteps })
                }
              }}
            />)
          })}
        </div>
      </Dialog>
    </div>)
  }
}
