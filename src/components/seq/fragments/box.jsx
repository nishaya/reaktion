// @flow

import styled from 'styled-components'

const Box = styled.div`
  margin: 4px;
  padding: 8px;
  border: 2px solid #999;
  background-color: ${props => props.theme.bgColor};
  display: inline-block;
  width: 148px;

  h2 {
    font-size: 16px;
    padding: 2px;
    margin: 2px;
  }
`

Box.defaultProps = {
  theme: { bgColor: '#eee' },
}

export default Box
