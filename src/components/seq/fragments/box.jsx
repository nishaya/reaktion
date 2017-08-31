// @flow

import styled from 'styled-components'

const Box = styled.div`
  margin: 4px;
  margin-bottom: 16px;
  padding: 8px;
  background-color: ${props => props.theme.bgColor};
  display: inline-block;
  width: 136px;
  box-shadow:1px 1px 2px 1px rgba(0,0,0,0.39);
  xfont-family: 'Roboto Mono', monospace;
  font-size: 14px;

  h2 {
    font-size: 18px;
    font-weight: 800;
    padding: 2px;
    margin: 2px;
    .text {
      vertical-align: top;
    }
  }

  .control {
    display: block;
    height: 180px;
  }
`

Box.defaultProps = {
  theme: { bgColor: '#eee' },
}

export default Box
