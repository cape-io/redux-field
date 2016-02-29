import test from 'tape'
import * as action from '../src/actions'

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
