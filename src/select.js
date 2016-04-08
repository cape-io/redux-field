import get from 'lodash/get'
import isFunction from 'lodash/isFunction'

import { defaultState } from './reducer'
import { getPrefix } from './utils'

export function selectForm(state) {
  return state.form
}
export function getErrorVal(state, { pristine, validate }) {
  if (pristine && !state.error) return null
  if (isFunction(validate)) {
    const errorVal = validate(state.value)
    if (errorVal) return errorVal
  }
  if (state.invalid[state.value]) return state.invalid[state.value]
  return state.error
}
export function getStatus(errorVal, isValid) {
  if (isValid) return 'success'
  if (!errorVal) return null
  return errorVal.status || 'error'
}
// Validate function should return a string or object
// error: { message: String, suggestion: String, status: String }
export function derivedState(state, { initialValue, validate }) {
  const initVal = state.initialValue || initialValue || defaultState.initialValue
  const pristine = state.value === initVal
  const errorVal = getErrorVal(state, { pristine, validate })
  const isValid = !errorVal && !pristine
  return state.merge({
    editing: state.focus && !pristine,
    dirty: !pristine,
    errorMessage: errorVal && errorVal.message ? errorVal.message : errorVal,
    hasError: !!errorVal,
    initialValue: initVal,
    invalidValue: state.invalid[state.value] || null,
    isValid,
    open: state.blur || state.focus,
    pristine,
    saved: !pristine && state.value === state.savedValue,
    status: getStatus(errorVal, isValid),
    suggestion: errorVal && errorVal.suggestion ? errorVal.suggestion : null,
    validValue: state.valid[state.value] || null,
  })
}

// Please note that it will return defaultState if there is an invalid prefix.
export function selectFieldState(state, prefix, selectFormState = selectForm) {
  return get(selectFormState(state), getPrefix(prefix), defaultState)
}
// Select prefix and selectForm from props.
export function getFieldState(state, props) {
  return selectFieldState(state, props.prefix, props.selectForm)
}
export function getState(state, props) {
  return derivedState(getFieldState(state, props), props)
}
