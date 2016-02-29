import test from 'tape'

import { getMeta, getPayload, getPrefix } from '../src/utils'
import { nativeEvent } from './mock'

const prefix = [ 'foo', 'bar' ]
test('getPrefix', t => {
  t.deepEqual(getPrefix(), [ 'default' ], 'noop returns default')
  t.deepEqual(getPrefix(1), [ 'default' ], 'number returns default')
  t.deepEqual(getPrefix({ foo: 'bar' }), [ 'default' ], 'obj returns default')
  t.equal(getPrefix(prefix), prefix, 'array returns itself')
  t.deepEqual(getPrefix('foo.bar'), prefix, 'dot notation is expanded')
  t.deepEqual(getPrefix({ fieldId: 'bar', formId: 'foo' }), prefix, 'fieldId formId obj')
  t.end()
})
test('getMeta', t => {
  t.deepEqual(getMeta('form.field', 'bar'), { prefix: [ 'form', 'field' ] })
  t.equal(getMeta(prefix, { foo: 'car' }).prefix, prefix)
  t.end()
})
test('getPayload', t => {
  t.equal(getPayload('hammer'), undefined)
  t.equal(getPayload('foo', 'bar'), 'bar')
  t.equal(getPayload('foo', ''), '')
  t.equal(getPayload([ 'default' ], nativeEvent), nativeEvent.target.value)
  t.end()
})
