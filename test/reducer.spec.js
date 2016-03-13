import test from 'tape'

import { close, fieldReducer as reducer, onChange, onSubmit, open } from '../src'
import { defaultState } from '../src/reducer'

test('reducer', t => {
  let state = reducer(undefined, onChange(null, 'jo'))
  t.deepEqual(state.default, defaultState.set('value', 'jo'), 'onChange')
  state = reducer(state, onSubmit(null, 'joy'))
  t.deepEqual(state.default, defaultState.merge({ value: 'joy', saving: true }), 'onSubmit')
  t.end()
})
test('open', t => {
  const action = open()
  let state = reducer(undefined, action)
  function get(id) { return state.default[id] }
  t.equal(get('focus'), true, 'focus')
  t.equal(get('initialValue'), null, 'initialValue')
  t.equal(get('value'), null, 'value')
  state = reducer(undefined, open(null, { initialValue: 'foo' }))
  t.equal(get('focus'), true, 'focus')
  t.equal(get('initialValue'), 'foo', 'initialValue')
  t.equal(get('value'), 'foo', 'value')
  state = reducer(state, close())
  t.equal(get('focus'), false, 'focus')
  t.equal(get('blur'), false, 'blur')
  state = reducer(state, open(null, { initialValue: 'bar' }))
  t.equal(get('focus'), true, 'focus')
  t.equal(get('value'), 'foo', 'value')
  t.equal(get('initialValue'), 'foo', 'initialValue')
  t.end()
})
