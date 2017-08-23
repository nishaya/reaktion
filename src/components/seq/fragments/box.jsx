// @flow

import styled from 'styled-components'

const Box = styled.div`
  margin: 4px;
  margin-bottom: 16px;
  padding: 8px;
  background-color: ${props => props.theme.bgColor};
  display: inline-block;
  width: 148px;
  box-shadow:1px 1px 2px 1px rgba(0,0,0,0.39);

  h2 {
    font-size: 16px;
    padding: 2px;
    margin: 2px;
  }

  .control {
    display: block;
    height: 200px;
  }
`

Box.defaultProps = {
  theme: { bgColor: '#eee' },
}

export default Box
