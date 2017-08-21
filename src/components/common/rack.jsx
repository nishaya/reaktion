// @flow

import styled from 'styled-components'

const Rack = styled.div`
  margin: 8px;
  padding: 8px;
  background-color: ${props => props.theme.bgColor};
  display: block;
  box-shadow:2px 2px 2px 0px rgba(0,0,0,0.39);

  h2 {
    font-size: 16px;
    padding: 2px;
    margin: 2px;
  }
`

Rack.defaultProps = {
  theme: { bgColor: '#eee' },
}

export default Rack
