// import { flow } from 'lodash/fp'
import {
  actionTypes, clear, clearError, close, onChange, meta,
} from './actions'

/* globals describe test expect */

describe('clear', () => {
  test('one arg return', () => {
    expect(clear('default'))
      .toEqual({ meta: { prefix: ['default'] }, type: actionTypes.CLEAR })
  })
  test('noop', () => {
    expect(clear('foo', 'bar'))
      .toEqual({ meta: { prefix: ['foo'] }, type: actionTypes.CLEAR })
  })
})

describe('clearError', () => {
  test('one arg return', () => {
    expect(clearError('foo'))
      .toEqual({ meta: { prefix: ['foo'] }, type: actionTypes.CLEAR_ERROR })
  })
  test('noop', () => {
    expect(clearError('fieldId', 'bar'))
      .toEqual({ meta: { prefix: ['fieldId'] }, type: actionTypes.CLEAR_ERROR })
  })
})

describe('close', () => {
  test('one arg return', () => {
    expect(close('foo'))
      .toEqual({ meta: { prefix: ['foo'] }, type: actionTypes.CLOSE })
  })
  test('noop', () => {
    expect(close('fieldId', 'bar'))
      .toEqual({ meta: { prefix: ['fieldId'] }, type: actionTypes.CLOSE })
  })
})

describe('onChange', () => {
  test('one arg return func', () => {
    expect(typeof onChange(['login', 'email'])).toBe('function')
    expect(onChange(['login', 'email'])('a'))
      .toEqual({ meta: { prefix: ['login', 'email'] }, type: actionTypes.CHANGE, payload: 'a' })
  })
  test('prefix and payload at same time', () => {
    expect(onChange(['login'], 'ab'))
      .toEqual({ meta: { prefix: ['login'] }, type: actionTypes.CHANGE, payload: 'ab' })
  })
})
describe('meta', () => {
  test('meta is payload object', () => {
    expect(typeof meta(null)).toBe('function')
    expect(meta(null)({ extra: 'foo' }))
      .toEqual({ meta: { prefix: ['default'] }, type: actionTypes.META, payload: { extra: 'foo' } })
  })
})
