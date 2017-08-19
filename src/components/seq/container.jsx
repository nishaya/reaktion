// @flow

import React, { Component } from 'react'
import { RaisedButton } from 'material-ui'
import Rack from 'components/common/rack'
import Track from './track'

const Button = RaisedButton

const MAX_TRACKS = 4

type State = {
  numTracks: number,
  tracks: Array<any>,
}

export default class SeqContainer extends Component {
  state: State = {
    numTracks: 2,
    tracks: [],
  }

  renderTracks() {
    const tracks = []
    for (let i = 0; i < this.state.numTracks; i += 1) {
      tracks.push(<Track key={`track_${i}`} />)
    }
    return tracks
  }

  addTrack() {
    const { tracks } = this.state
    if (tracks.length < MAX_TRACKS) {
      tracks.push(<Track key={`track_${tracks.length}`} />)
    }
    this.setState({ tracks })
  }

  render() {
    const { tracks } = this.state
    return (<Rack>
      <h2>seq</h2>
      {tracks}
      <div>
        <Button onClick={() => this.addTrack()}>Add Track</Button>
      </div>
    </Rack>)
  }
}
