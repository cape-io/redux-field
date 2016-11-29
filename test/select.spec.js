import test from 'tape'
import { noop } from 'lodash'

import { invalid, onChange, valid } from '../src/actions'
import { getErrorVal, getState, selectFieldState } from '../src/select'
import reducer, { defaultState } from '../src/reducer'

import { emptyGetStateResult } from './mock'
import { invalidDomain, isRequired } from './validate'

test('getState', (t) => {
  const props = { validate: isRequired }
  t.deepEqual(getState({}, props), emptyGetStateResult, 'empty')
  const state = reducer({}, onChange(null, ''))
  const dirty = emptyGetStateResult.merge({
    errorMessage: 'Required',
    hasError: true,
    isDirty: true,
    isPristine: false,
    isValid: false,
    status: 'error',
    isTouched: true,
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
    valid: { 'kai@foo.x': { message: 'welcome' } },
    validValue: { message: 'welcome' },
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
test('getErrorVal', (t) => {
  const errorVal = getErrorVal(
    { error: 'error msg', invalid: {}, value: null },
    { pristine: true }
  )
  t.equal(errorVal, 'error msg', 'errorVal')
  const nullErr = getErrorVal({ error: null }, { pristine: true })
  t.equal(nullErr, null, 'nullError')
  const invalidErr = getErrorVal(
    { error: null, invalid: { foo: 'error msg' }, value: 'foo' },
    { pristine: false, validate: noop }
  )
  t.equal(invalidErr, 'error msg', 'invalidErr')
  const validateErr = getErrorVal(
    { error: null, invalid: { foo: 'error msg' }, value: 'foo' },
    { pristine: false, validate: () => 'invalid' }
  )
  t.equal(validateErr, 'invalid', 'invalidErr')

  t.end()
})
test('selectFieldState', (t) => {
  t.deepEqual(
    selectFieldState({ form: {} }, 'default'),
    defaultState,
    'defaultState'
  )
  t.equal(
    selectFieldState({ form: { default: { value: 'foo' } } }, 'default').value,
    'foo',
    'basic select value'
  )
  t.end()
})
