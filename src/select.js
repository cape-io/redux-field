import {
  at, concat, find, flow, get, getOr, identity, isFunction, nthArg, partial,
} from 'lodash/fp'

import { select } from 'cape-select'
import { defaultState } from './reducer'
import { createPrefix } from './utils'

export const REDUCER_KEY = 'form'

export const selectForm = get(REDUCER_KEY)

// fieldSelector(prefixArray)(state)
export const getFieldSelector = partial(select, [selectForm])

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
export function derivedState(state, initialValue, validate) {
  const initVal = state.initialValue || initialValue || defaultState.initialValue
  const pristine = state.value === initVal
  const errorVal = getErrorVal(state, { pristine, validate })
  const isValid = !errorVal && !pristine
  const isOpen = state.blur || state.focus
  return {
    ...state,
    errorMessage: errorVal && errorVal.message ? errorVal.message : errorVal,
    hasError: !!errorVal,
    initialValue: initVal,
    invalidValue: state.invalid[state.value] || null,
    isClosed: !isOpen,
    isDirty: !pristine,
    isEditing: state.focus && !pristine,
    isOpen,
    isPristine: pristine,
    isSaved: !pristine && state.value === state.savedValue,
    isValid,
    status: getStatus(errorVal, isValid),
    suggestion: errorVal && errorVal.suggestion ? errorVal.suggestion : null,
    validValue: state.valid[state.value] || null,
  }
}
// export function calcState(state) {
// }

// The new core of selecting state based on prefix.
export const getPrefix = flow(at(['prefix', 'id']), find(identity), createPrefix)
export const selectPrefix = flow(nthArg(1), getPrefix)
export const prependKey = concat(REDUCER_KEY)
export const fieldSelector = flow(createPrefix, prependKey, getOr(defaultState))
export const getFormState = flow(getPrefix, fieldSelector)
export const selectField = (state, props) => getFormState(props)(state)
export const selectFieldValue = flow(selectField, get('value'))
export const calcFieldState = flow(selectField, derivedState)

// // Older stuff
// // Please note that it will return defaultState if there is an invalid prefix.
// export function selectFieldState(state, prefix, selectFormState = selectForm) {
//   return get(selectFormState(state), createPrefix(prefix), defaultState)
// }
// // Select prefix and selectForm from props.
// export function getFieldState(state, props) {
//   return selectFieldState(state, props.prefix, props.selectForm)
// }
// export const getState = createSelector(
//   getFieldState, getProp('initialValue'), getProp('validate'), derivedState
// )
// export function getFieldValue(state, prefix, selectFormState, prop = 'value') {
//   return get(selectFieldState(state, prefix, selectFormState), prop)
// }

// // Returns selector.
// export function fieldValue(prefix, prop = 'value') {
//   return state => get(selectFieldState(state, prefix), prop)
// }
