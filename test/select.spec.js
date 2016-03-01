import test from 'tape'

import { onChange } from '../src/actions'
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
    pristine: false,
    status: 'error',
    value: '',
  })
  t.deepEqual(getState({ form: state }, props), dirty, 'empty value')
  t.end()
})
