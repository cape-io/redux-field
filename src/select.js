import get from 'lodash/get'
import isFunction from 'lodash/isFunction'

import { defaultState } from './reducer'
import { getPrefix } from './utils'

export function selectForm(state) {
  return state.form
}
export function getErrorVal(state, { pristine, validate }) {
  if (pristine) return null
  if (isFunction(validate)) {
    const errorVal = validate(state.value)
    if (errorVal) return errorVal
  }
  if (state.invalid[state.value]) return state.invalid[state.value]
  return state.error
}
// Validate function should return a string or object
// error: { message: String, suggestion: String, status: String }
export function derivedState(state, { initialValue, validate }) {
  const initVal = state.initialValue || initialValue || defaultState.initialValue
  const pristine = state.value === initVal
  const errorVal = getErrorVal(state, { pristine, validate })
  let status = errorVal ? 'error' : null
  if (errorVal && errorVal.status) {
    status = errorVal.status
  }
  // Has value value and there are no errors.
  const isValid = !errorVal && !pristine
  if (isValid) {
    status = 'success'
  }
  return state.merge({
    editing: state.focus && !pristine,
    dirty: !pristine,
    errorMessage: errorVal && errorVal.message ? errorVal.message : errorVal,
    hasError: !!errorVal,
    initialValue: initVal,
    invalid: state.invalid[state.value] || null,
    isValid,
    open: state.blur || state.focus,
    pristine,
    saved: !pristine && state.value === state.savedValue,
    status,
    suggestion: errorVal && errorVal.suggestion ? errorVal.suggestion : null,
    valid: state.valid[state.value] || null,
  })
}
export function getState(state, props) {
  const selectFormState = props.selectForm || selectForm
  const prefix = getPrefix(props.prefix)
  const fieldState = get(selectFormState(state), prefix, defaultState)
  return derivedState(fieldState, props)
}
