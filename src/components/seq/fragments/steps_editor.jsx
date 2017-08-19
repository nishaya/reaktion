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
          {steps.map((step, index) => {
            const checked = step !== -1
            const key = `e_${index}`
            return (<Checkbox
              key={key}
              style={{ padding: 0, margin: 0, width: 30 }}
              checked={checked}
              onCheck={(e, v) => {
                const newSteps = steps.slice(0)
                newSteps[index] = v ? 64 : -1
                onEdit(newSteps)
              }}
            />)
          })}
        </div>
      </Dialog>
    </div>)
  }
}
