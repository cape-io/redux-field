import {
  calcFieldState, fieldSelector, getPrefix, prependKey,
} from './select'
import { defaultState } from './reducer'
/* globals describe test expect */

describe('prependKey', () => {
  test('prepend form onto array', () => {
    expect(prependKey([])).toEqual(['form'])
    expect(prependKey(['foo'])).toEqual(['form', 'foo'])
  })
})

describe('fieldSelector', () => {
  test('returns array with form added to front', () => {
    const selector = fieldSelector('foo')
    expect(typeof selector).toBe('function')
    const fieldState = selector({ form: {} })
    expect(fieldState).toBe(defaultState)
    const state = { form: { foo: { value: '' } } }
    const fieldState2 = selector(state)
    expect(fieldState2).toBe(state.form.foo)
  })
})
describe('calcFieldState', () => {
  const state = { form: { foo: { value: '' } } }
  test('returns field of prefix', () => {
    const res = calcFieldState(state, { id: 'bar' })
    expect(res).toEqual({
      blur: false,
      dragCount: 0,
      error: null,
      errorMessage: null,
      focus: false,
      hasError: false,
      id: null,
      initialValue: null,
      invalid: {},
      invalidValue: null,
      isClosed: true,
      isDirty: false,
      isEditing: false,
      isOpen: false,
      isPristine: true,
      isSaved: false,
      isSaving: false,
      isTouched: false,
      isValid: false,
      meta: null,
      savedProgress: 0,
      savedValue: null,
      status: null,
      suggestion: null,
      valid: {},
      validValue: null,
      value: null,
    })
  })
})
describe('getPrefix', () => {
  test('returns prefix prop value', () => {
    expect(getPrefix({ prefix: 'foo' })).toEqual(['foo'])
    expect(getPrefix({ prefix: 'bar.foo', other: 'baz' })).toEqual(['bar', 'foo'])
  })
  test('returns prefix prop before id value', () => {
    expect(getPrefix({ prefix: 'foo', id: 'baz' })).toEqual(['foo'])
    expect(getPrefix({ prefix: 'bar', id: 'ling', other: 'baz' })).toEqual(['bar'])
  })
  test('returns id prop value when prefix is falsey', () => {
    expect(getPrefix({ prefix: null, id: 'baz' })).toEqual(['baz'])
    expect(getPrefix({ id: 'ling', other: 'baz' })).toEqual(['ling'])
    expect(getPrefix({ id: 'ding.ling', prefix: false })).toEqual(['ding', 'ling'])
  })
})
