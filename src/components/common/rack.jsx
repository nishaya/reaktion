// @flow

import styled from 'styled-components'

const Rack = styled.div`
  padding: 4px;
  border: 2px solid #999;
  background-color: ${props => props.theme.bgColor};
  display: block;

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
