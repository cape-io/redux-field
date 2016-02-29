import test from 'tape'
import functions from 'lodash/functions'
import keys from 'lodash/keys'

import * as action from '../src/actions'

import { formEvent, formHandler, fieldEvent } from './mock'

test('actions', t => {
  t.deepEqual(
    action.clear(null, 'fieldId'),
    { meta: { prefix: [ 'fieldId' ] }, type: action.CLEAR },
    'clear()',
  )
  t.deepEqual(
    action.clearError('fieldId'),
    { meta: { prefix: [ 'fieldId' ] }, type: action.CLEAR_ERROR },
    'clearError()',
  )
  t.deepEqual(
    action.close('fieldId'),
    { meta: { prefix: [ 'fieldId' ] }, type: action.CLOSE },
    'close()',
  )
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
