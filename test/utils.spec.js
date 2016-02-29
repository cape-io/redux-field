import test from 'tape'

import { getPrefix } from '../src/utils'

test('getPrefix', t => {
  t.deepEqual(getPrefix(), [ 'default' ], 'noop returns default')
  const prefix = [ 'foo', 'bar' ]
  t.equal(getPrefix(prefix), prefix, 'array returns itself')
  t.deepEqual(getPrefix('foo.bar'), prefix, 'dot notation is expanded')
  t.end()
})
