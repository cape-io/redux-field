import test from 'tape'

import { fieldReducer as reducer, onChange, onSubmit } from '../src'
import { defaultState } from '../src/reducer'

test('reducer', t => {
  let state = reducer(undefined, onChange(null, 'jo'))
  t.deepEqual(state.default, defaultState.set('value', 'jo'))
  state = reducer(state, onSubmit(null, 'joy'))
  t.deepEqual(state.default, defaultState.merge({ value: 'joy', saving: true }))
  t.end()
})
