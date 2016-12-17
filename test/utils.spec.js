import test from 'tape'

import { getMeta, createPayload, getPrefix, getProgress } from '../src/utils'
import { nativeEvent } from './mock'

const prefix = ['foo', 'bar']
test('getPrefix', (t) => {
  t.deepEqual(getPrefix(), ['default'], 'noop returns default')
  t.deepEqual(getPrefix(1), ['default'], 'number returns default')
  t.deepEqual(getPrefix({ foo: 'bar' }), ['default'], 'obj returns default')
  t.equal(getPrefix(prefix), prefix, 'array returns itself')
  t.deepEqual(getPrefix('foo.bar'), prefix, 'dot notation is expanded')
  t.deepEqual(getPrefix({ fieldId: 'bar', formId: 'foo' }), prefix, 'fieldId formId obj')
  t.end()
})
test('getMeta', (t) => {
  t.deepEqual(getMeta('form.field', 'bar', 'candy'), { prefix: ['form', 'field'] })
  t.equal(getMeta(prefix, { foo: 'car' }).prefix, prefix)
  t.deepEqual(getMeta(prefix, null, { sendSocket: false }), { prefix, sendSocket: false })
  t.end()
})
test('createPayload', (t) => {
  t.equal(createPayload('hammer'), undefined)
  t.equal(createPayload('foo', 'bar'), 'bar')
  t.equal(createPayload('foo', ''), '')
  t.equal(createPayload(['default'], nativeEvent), nativeEvent.target.value)
  t.end()
})
test('getProgress', (t) => {
  t.equal(getProgress('10.2'), 10, 'string')
  t.equal(getProgress(10.2), 10, 'number')
  t.equal(getProgress({ loaded: 256, total: 510 }), 50, 'event')
  t.equal(getProgress({ bytesTransferred: 256, totalBytes: 510 }), 50, 'firebase')
  t.equal(getProgress({ bytesTransferred: 0, totalBytes: 510 }), 0, 'zero progress')
  t.end()
})
