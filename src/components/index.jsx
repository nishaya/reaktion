// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SeqContainer from 'components/seq/container'
import SamplerContainer from 'components/sampler'
import type { Sample } from 'types/sampler'
import { Tabs, Tab } from 'material-ui'

type Props = {
  samples: { [string]: Sample },
}

export class IndexComponent extends Component {
  static childContextTypes = {
    samples: PropTypes.shape(),
  }

  props: Props

  getChildContext() {
    return { samples: this.props.samples }
  }

  render() {
    return (<Tabs>
      <Tab label="Sequencer">
        <SeqContainer />
      </Tab>
      <Tab label="Sampler">
        <SamplerContainer />
      </Tab>
    </Tabs>)
  }
}

const mapStateToProps = store => ({ samples: store.sample.samples })

const mapDispatchToProps = dispatch => bindActionCreators(
  {},
  dispatch,
)

export default connect(mapStateToProps, mapDispatchToProps)(IndexComponent)
