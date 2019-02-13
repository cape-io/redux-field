// import { flow } from 'lodash/fp'
import reducer, {
  close, onBlur, onChange, onDragEnter, onDragLeave, onFocus, onSubmit, open,
  saveProgress, savedProgress, selectFieldState,
} from '.'

import {
  blurReducer, applyError, changeReducer, closeReducer,
  defaultState, dragEnterReducer, dragLeaveReducer, errorReducer,
  getDragCount, openReducer, saveProgressReducer, setFocus, setValue, submitReducer,
} from './reducer'

/* globals describe test expect */
describe('setValue', () => {
  test('leave state untouched when undefined new value', () => {
    const state = {}
    expect(setValue(state)).toBe(state)
    expect(setValue(state, undefined)).toBe(state)
    expect(setValue(state, null)).not.toBe(state)
  })
  test('leave state untouched when value matches state', () => {
    const state = { value: 'foo' }
    expect(setValue(state, 'foo')).toBe(state)
  })
  test('replace state when new value', () => {
    const state = { value: 'foo' }
    const update = setValue(state, 'bar')
    expect(update).not.toBe(state)
    expect(update).toEqual({ value: 'bar' })
  })
})

describe('getDragCount', () => {
  test('sets blur and focus to false', () => {
    expect(getDragCount(defaultState)).toBe(0)
  })
})

describe('blurReducer', () => {
  test('update value', () => {
    const state = { blur: false, dragCount: 2, value: 'foo' }
    expect(blurReducer(state, 'bar')).toEqual({
      blur: true,
      dragCount: 0,
      focus: false,
      isTouched: true,
      value: 'bar',
    })
    expect(blurReducer({ blur: false, dragCount: 2, value: null }, '')).toEqual({
      blur: true,
      dragCount: 0,
      focus: false,
      isTouched: true,
      value: '',
    })
  })
  test('blur reducer', () => {
    const state = reducer(undefined, onBlur('example', { nativeEvent: {}, target: {} }))
    expect(state).toEqual({
      example: {
        ...defaultState, value: '', blur: true, isTouched: true,
      },
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
describe('changeReducer', () => {
  test('replace when untouched but value match', () => {
    const state = { value: 'foo' }
    const change = changeReducer(state, 'foo')
    expect(change).not.toBe(state)
    expect(change).toEqual({ value: 'foo', isTouched: true })
  })
  const state = { value: 'foo', isTouched: true }
  test('ignore when touched and value match', () => {
    const change = changeReducer(state, 'foo')
    expect(change).toBe(state)
  })
  test('replace when new value', () => {
    const change = changeReducer(state, 'bar')
    expect(change).not.toBe(state)
    expect(change).toEqual({ value: 'bar', isTouched: true })
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
  test('leave value alone', () => {
    const res2 = {
      blur: false, focus: true, isTouched: true, value: '',
    }
    expect(setFocus({ value: '' })).toEqual(res2)
    expect(setFocus(blurReducer(res2, ''))).toEqual({ ...res2, dragCount: 0 })
  })
  test('focus action', () => {
    let state = reducer(undefined, onFocus('example')())
    expect(state).toEqual({ example: { ...defaultState, ...res } })
    state = reducer(state, onBlur('example', { nativeEvent: {}, target: {} }))
    expect(state).toEqual({
      example: {
        ...defaultState, value: '', blur: true, isTouched: true,
      },
    })
    expect(state.example.value).toBe('')
    state = reducer(state, onFocus('example')())
    expect(state.example.value).toBe('')
    expect(state).toEqual({ example: { ...defaultState, ...res, value: '' } })
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
