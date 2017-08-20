// @flow

import React, { Component } from 'react'
import { RaisedButton, FontIcon } from 'material-ui'
import type { Steps } from 'types/step'
import Rack from 'components/common/rack'
import Track from './track'

const Button = RaisedButton

const MAX_TRACKS = 4

type State = {
  tracks: Array<Track>,
  stepsMap: Map<number, Steps>,
}

type Props = {
  defaultTracks: number,
}

export default class SeqContainer extends Component {
  static defaultProps = {
    defaultTracks: 2,
  }

  state: State = {
    tracks: [],
    stepsMap: new Map(),
  }

  componentDidMount() {
    this.addTrack(this.props.defaultTracks)
  }

  props: Props

  addTrack(num: number = 1) {
    const { tracks } = this.state
    if (tracks.length + num <= MAX_TRACKS) {
      for (let i = 0; i < num; i += 1) {
        const trackId = tracks.length
        const props = {
          onTrackFixed: (steps: Steps, id: number) => {
            console.log(`track #${id} fixed(SeqContainer)`, steps)
            const { stepsMap } = this.state
            stepsMap.set(id, steps)
            console.log('stepsMap', stepsMap)
            this.setState({ stepsMap })
          },
          trackId,
        }
        tracks.push(<Track key={`track_${trackId}`} {...props} />)
      }
    }
    this.setState({ tracks })
  }

  render() {
    const { tracks } = this.state
    return (<Rack>
      <h2>seq</h2>
      {tracks}
      <div>
        <Button
          icon={<FontIcon className="material-icons">add</FontIcon>}
          disabled={tracks.length >= MAX_TRACKS}
          onClick={() => this.addTrack()}
          label="Add Track"
        />
      </div>
    </Rack>)
  }
}
