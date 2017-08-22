// @flow

import React, { Component } from 'react'
import SeqContainer from 'components/seq/container'
import SamplerContainer from 'components/sampler'

export default class IndexComponent extends Component {
  render() {
    return (<div>
      <SamplerContainer />
      <SeqContainer />
    </div>)
  }
}
