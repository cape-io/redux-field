import test from 'tape'

import { getPrefix } from '../src/utils'

test('getPrefix', t => {
  t.deepEqual(getPrefix(), [ 'default' ], 'noop returns default')
  t.deepEqual(getPrefix(1), [ 'default' ], 'number returns default')
  t.deepEqual(getPrefix({ foo: 'bar' }), [ 'default' ], 'obj returns default')
  const prefix = [ 'foo', 'bar' ]
  t.equal(getPrefix(prefix), prefix, 'array returns itself')
  t.deepEqual(getPrefix('foo.bar'), prefix, 'dot notation is expanded')
  t.deepEqual(getPrefix({ fieldId: 'bar', formId: 'foo' }), prefix, 'fieldId formId obj')
  t.end()
})
