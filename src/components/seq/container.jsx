// @flow

import React, { Component } from 'react'
import { RaisedButton } from 'material-ui'
import Rack from 'components/common/rack'
import Track from './track'

const Button = RaisedButton

const MAX_TRACKS = 4

type State = {
  tracks: Array<any>,
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
  }

  componentDidMount() {
    this.addTrack(this.props.defaultTracks)
  }

  props: Props

  addTrack(num: number = 1) {
    const { tracks } = this.state
    if (tracks.length + num <= MAX_TRACKS) {
      for (let i = 0; i < num; i += 1) {
        tracks.push(<Track key={`track_${tracks.length}`} />)
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
        <Button disabled={tracks.length >= MAX_TRACKS} onClick={() => this.addTrack()}>
          Add Track
        </Button>
      </div>
    </Rack>)
  }
}
