import test from 'tape'

import { getState } from '../src/select'
import { emptyGetStateResult } from './mock'

test('getState', t => {
  t.deepEqual(getState({}, {}), emptyGetStateResult)
  t.end()
})
