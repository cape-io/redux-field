import immutable from 'seamless-immutable'
import { combineReducers, createStore } from 'redux'
import reducer, { REDUCER_KEY } from '../src'

export const store = createStore(combineReducers({ [REDUCER_KEY]: reducer }))

export const emptyGetStateResult = immutable({
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
export const fieldEvent = [
  'clear', 'clearError', 'close', 'error', 'invalid',
  'meta', 'open', 'save', 'saved', 'savedProgress', 'valid',
]
export const formEvent = [
  'onBlur', 'onChange', 'onFocus', 'onInput', 'onSubmit',
]
export const formHandler = [
  'handleBlur', 'handleChange', 'handleFocus', 'handleInput', 'handleSubmit',
]
export const nativeEvent = {
  nativeEvent: true,
  target: {
    value: 'Kumbaya',
  },
}
