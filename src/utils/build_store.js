// @flow

import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import reducers from 'reducers/index'

export function buildStore() {
  const middlewares = process.env.NODE_ENV === 'development' ?
  applyMiddleware(createLogger()) : applyMiddleware()
  return createStore(reducers, middlewares)
}

export default {
  buildStore,
}
