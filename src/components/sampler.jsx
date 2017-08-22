// @flow

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SampleActions from 'actions/sample'
import Rack from 'components/common/rack'

class SamplerComponent extends Component {
  static propTypes = {
    storeSample: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.storeSample({
      id: 'xxx',
      name: 'noise',
      buffer: new ArrayBuffer(),
    })
  }

  render() {
    return (<Rack>
      <h2>sampler</h2>
    </Rack>)
  }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => bindActionCreators(
  { ...SampleActions },
  dispatch,
)

export default connect(mapStateToProps, mapDispatchToProps)(SamplerComponent)
