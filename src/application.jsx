// @flow

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import RedBox from 'redbox-react'
import { buildStore } from 'utils/build_store'
import IndexContainer from 'components/index'
import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

injectTapEventPlugin()

const store = buildStore()
const root = document.getElementById('app')

try {
  render(
    (<Provider store={store}>
      <MuiThemeProvider>
        <div>
          <IndexContainer />
        </div>
      </MuiThemeProvider>
    </Provider>),
    root,
  )
} catch (e) {
  render(<RedBox error={e} />, root)
}
