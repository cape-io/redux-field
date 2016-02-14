import test from 'tape'

import { getInitState } from '../src'
import { location } from './mock'

test('getInitState() should have', assert => {
  const title = 'Title thing'
  const { firstKey, activeKey, key, length } = getInitState(location, title)

  assert.equal(firstKey, activeKey, 'matching firstKey and activeKey')
  assert.equal(length, 1, 'length prop set to 1')
  assert.equal(key[activeKey].title, title, 'title arg added as title prop')
  const keyLocation = { pathname: '/foo', hash: '#xk', search: '' }
  assert.deepEqual(key[activeKey].location, keyLocation, 'location prop attached')
  assert.end()
})
