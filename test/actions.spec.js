import test from 'tape'
import functions from 'lodash/functions'
import keys from 'lodash/keys'

import * as action from '../src/actions'

import { formEvent, formHandler, fieldEvent } from './mock'

test('actions', t => {
  t.deepEqual(
    action.clear(),
    { meta: { prefix: [ 'default' ] }, type: action.CLEAR },
    'clear()',
  )
  t.deepEqual(
    action.clearError('fieldId', ''),
    { meta: { prefix: [ 'fieldId' ] }, type: action.CLEAR_ERROR },
    'clearError()',
  )
  t.deepEqual(
    action.close('fieldId', 'yum'),
    { meta: { prefix: [ 'fieldId' ] }, type: action.CLOSE },
    'close()',
  )
  t.deepEqual(
    action.onChange([ 'login', 'email' ], 'a'),
    { meta: { prefix: [ 'login', 'email' ] }, type: action.CHANGE, payload: 'a' }
  )
  t.deepEqual(
    action.meta(null, {}, { extra: true }),
    { meta: { extra: true, prefix: [ 'default' ] }, type: action.META, payload: {} }
  )
  t.end()
})
test('savedProgress', t => {
  function dispatch(expected) { return progress => t.deepEqual(progress, expected, 'dispatched') }
  const act = { meta: { prefix: [ 'default' ] }, type: 'field/SAVED_PROGRESS', payload: 10 }
  action.savedProgress(null, 10)(dispatch(act))
  t.equal(action.savedProgress(null, 11)(t.fail), false, 'not multiple of 5.')
  t.end()
})
test('action bundles', t => {
  t.deepEqual(functions(action.formEvent), formEvent, 'formEvent')
  t.deepEqual(functions(action.formHandler), formHandler, 'formHandler')
  t.deepEqual(functions(action.fieldEvent), fieldEvent, 'fieldEvent')
  const acts = action.getActions([ 'default' ])
  t.deepEqual(keys(acts), [ 'fieldEvent', 'formEvent', 'formHandler' ])
  t.deepEqual(functions(acts.formEvent), formEvent)
  t.deepEqual(functions(acts.formHandler), formHandler)
  t.deepEqual(functions(acts.fieldEvent), fieldEvent)
  t.end()
})
