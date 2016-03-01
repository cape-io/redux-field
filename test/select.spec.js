import test from 'tape'

import { invalid, onChange, valid } from '../src/actions'
import { getState } from '../src/select'
import reducer from '../src/reducer'

import { emptyGetStateResult } from './mock'
import { invalidDomain, isRequired } from './validate'

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
  state2 = reducer(state2, valid(null, { key: 'kai@foo.x', value: { message: 'welcome' } }))
  const dirty2 = dirty.merge({
    errorMessage: null,
    hasError: false,
    isValid: true,
    status: 'success',
    valid: { message: 'welcome' },
    value: 'kai@foo.x',
  })
  t.deepEqual(getState({ form: state2 }, {}), dirty2, 'valid is set')
  state2 = reducer(state2, onChange(null, 'kai@foo.xx'))
  state2 = reducer(state2,
    invalid(null, { key: 'kai@foo.xx', value: { message: 'wrong domain' } })
  )
  t.equal(getState({ form: state2 }, {}).errorMessage, 'wrong domain')
  props.validate = invalidDomain
  t.equal(getState({ form: state2 }, props).errorMessage, 'invalid domain')
  t.end()
})
