import get from 'lodash/get'
import isFunction from 'lodash/isFunction'

export function selectForm(state) {
  return state.form
}
// Validate function should return a string or object
// error: { message: String, suggestion: String, status: String }
export function derivedState(state, validate, initialValue) {
  const errorVal = isFunction(validate) ? validate(state.value) : state.error
  const pristine = state.value === state.initalValue
  let status = errorVal ? 'error' : null
  if (errorVal && errorVal.status) {
    status = errorVal.status
  }
  const isValid = !errorVal && !pristine
  if (isValid) {
    status = 'success'
  }
  return state.merge({
    editing: state.focus && !pristine,
    dirty: !pristine,
    errorMessage: errorVal && errorVal.message ? errorVal.message : errorVal,
    hasError: !!errorVal,
    initialValue: state.initialValue || initialValue,
    open: state.blur || state.focus,
    pristine,
    saved: pristine || state.value === state.savedValue,
    status,
    suggestion: errorVal && errorVal.suggestion ? errorVal.suggestion : undefined,
    isValid,
  })
}
export function getState(formState, prefix, validate, initialValue) {
  return derivedState(get(formState, prefix), validate, initialValue)
}
