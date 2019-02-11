import { flow } from 'lodash/fp'
import reducer, {
  close, onChange, onDragEnter, onDragLeave, onSubmit, open,
  saveProgress, savedProgress, selectFieldState,
} from '.'

import {
  blurReducer, applyError, closeReducer,
  defaultState, dragEnterReducer, dragLeaveReducer, errorReducer,
  getDragCount, openReducer, saveProgressReducer, setFocus, submitReducer,
} from './reducer'

/* globals describe test expect */

describe('getDragCount', () => {
  test('sets blur and focus to false', () => {
    expect(getDragCount(defaultState)).toBe(0)
  })
})

describe('blurReducer', () => {
  test('simple get of value', () => {
    expect(blurReducer({ blur: false, dragCount: 2, value: 'foo' }, 'bar')).toEqual({
      blur: true,
      dragCount: 0,
      focus: false,
      isTouched: true,
      value: 'bar',
    })
  })
})

describe('openReducer', () => {
  const res = {
    focus: true,
    id: null,
    initialValue: null,
    isTouched: true,
    value: null,
  }
  test('set focus and touched', () => {
    expect(openReducer({}, {})).toEqual(res)
  })
  test('leave id alone', () => {
    expect(openReducer({ id: 1 }, {})).toEqual({
      ...res,
      id: 1,
    })
  })
  test('set id on open', () => {
    expect(openReducer({ id: 1 }, { id: 2 })).toEqual({
      ...res,
      id: 2,
    })
  })
  test('overwrite initialValue', () => {
    expect(openReducer({ value: 1, initialValue: 1 }, { initialValue: 2 })).toEqual({
      ...res,
      value: 1,
      initialValue: 2,
    })
  })
  test('no overwrite of value on open', () => {
    expect(openReducer({ value: 1 }, { value: 2 })).toEqual({
      ...res,
      value: 1,
      initialValue: 1,
    })
  })
  test('set value from initVal', () => {
    expect(openReducer({}, { initialValue: 2 })).toEqual({
      ...res,
      value: 2,
      initialValue: 2,
    })
  })
})

describe('closeReducer', () => {
  const res = {
    blur: false,
    focus: false,
    isTouched: true,
  }
  test('set touched', () => {
    expect(closeReducer({}, {})).toEqual(res)
  })
  test('leave value alone. Do not use any values from action.', () => {
    expect(closeReducer({ value: 1 }, { value: 2, id: 4 })).toEqual({
      ...res,
      value: 1,
    })
  })
})
describe('reducer open close', () => {
  const openState = {
    ...defaultState,
    focus: true,
    isTouched: true,
  }
  let state = reducer(undefined, open(null, undefined))
  test('set focus touched', () => {
    expect(state.default).toEqual(openState)
  })
  test('set value from initVal', () => {
    expect(reducer(undefined, open(null, { initialValue: 2 })).default).toEqual({
      ...openState,
      value: 2,
      initialValue: 2,
    })
    expect(reducer(state, open(null, { initialValue: 2 })).default).toEqual({
      ...openState,
      value: 2,
      initialValue: 2,
    })
  })
  test('open and close state', () => {
    state = reducer(state, close('default'))
    expect(state.default).toEqual({
      ...defaultState,
      isTouched: true,
    })
    state = reducer(state, open(null, { initialValue: 'bar', value: 'foo' }))
    expect(state.default).toEqual({
      ...openState,
      initialValue: 'bar',
      value: 'bar',
    })
  })
})
describe('focusReducer', () => {
  const res = { blur: false, focus: true, isTouched: true }
  test('sets blur and focus to false', () => {
    expect(setFocus({ blur: true, focus: true })).toEqual(res)
    expect(setFocus({})).toEqual(res)
  })
  test('blur reducer will toggle blur/focus', () => {
    const res2 = blurReducer(res)
    expect(res2).toEqual({
      blur: true, dragCount: 0, focus: false, isTouched: true,
    })
    expect(setFocus(res2)).toEqual({ ...res, dragCount: 0 })
  })
})
describe('applyError', () => {
  const errStr = 'error msg'
  const res = { error: errStr, isTouched: true }
  test('add error string', () => {
    expect(applyError({}, errStr)).toEqual(res)
  })
  test('overwrite error', () => {
    expect(applyError({}, 'junk')).toEqual({ error: 'junk', isTouched: true })
  })
})
describe('errorReducer', () => {
  const errStr = 'error msg'
  const res = { error: errStr, isTouched: true }
  test('add error string when payload is string', () => {
    expect(errorReducer({}, errStr)).toEqual(res)
  })
  test('add error string and value when payload is obj', () => {
    expect(errorReducer({}, { error: errStr, value: 'bas' }))
      .toEqual({ error: errStr, value: 'bas', isTouched: true })
  })
})