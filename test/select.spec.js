import test from 'tape'

import { onChange, valid } from '../src/actions'
import { getState } from '../src/select'
import reducer from '../src/reducer'

import { emptyGetStateResult } from './mock'
import { isRequired } from './validate'

test('getState', t => {
  const props = { validate: isRequired }
  t.deepEqual(getState({}, props), emptyGetStateResult, 'empty')
  const state = reducer({}, onChange(null, ''))
  const dirty = emptyGetStateResult.merge({
    errorMessage: 'Required',
    dirty: true,
    hasError: true,
    isValid: false,
    pristine: false,
    status: 'error',
    value: '',
  })
  t.deepEqual(getState({ form: state }, props), dirty, 'empty value')
  let state2 = reducer(state, onChange(null, 'kai@foo.x'))
  state2 = reducer(state2, valid(null, { key: 'kai@foo.x', value: { message: 'invalid' } }))
  const dirty2 = dirty.merge({
    errorMessage: null,
    hasError: false,
    isValid: true,
    status: 'success',
    valid: { message: 'invalid' },
    value: 'kai@foo.x',
  })
  t.deepEqual(getState({ form: state2 }, {}), dirty2, 'valid is set')
  t.end()
})
