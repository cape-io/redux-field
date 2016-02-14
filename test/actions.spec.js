import test from 'tape'
import { getLocationObject, create } from '../src/actions'
import { location } from './mock'

test('getLocationObject() should', assert => {
  const result = { pathname: '/foo', hash: '#xk', search: '' }
  assert.deepEqual(getLocationObject(location), result, 'remove extra props')
  assert.end()
})

test('create() action creator should', assert => {
  const title = 'Kittens'
  const key = 'ookz9llerk9'
  const result = {
    type: '@@history/CREATE',
    payload: {
      title,
      location: { pathname: '/foo', hash: '#xk', search: '' },
      key,
    },
    meta: { pushState: true },
  }
  assert.deepEqual(create(location, title, key), result, 'create valid action.')
  assert.end()
})
