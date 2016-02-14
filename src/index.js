import immutable from 'seamless-immutable'
import get from 'lodash/get'
import invert from 'lodash/invert'
import isFunction from 'lodash/isFunction'
import isString from 'lodash/isString'
import isUndefined from 'lodash/isUndefined'

export connectField from './connectField'

export const BLUR = 'field/BLUR'
export const CLEAR = 'field/CLEAR'
export const CLEAR_ERROR = 'field/CLEAR_ERROR'
export const CLOSE = 'field/CLOSE'
export const ERROR = 'field/ERROR'
export const FOCUS = 'field/FOCUS'
export const META = 'field/META'
export const OPEN = 'field/OPEN'
export const SAVE = 'field/SAVE'
export const SAVED = 'field/SAVED'
export const SUBMIT = 'field/SUBMIT'
export const UPDATE = 'field/UPDATE'
export const TOGGLE_VALIDATING = 'field/TOGGLE_VALIDATING'

export const types = {
  BLUR, CLEAR, CLEAR_ERROR, CLOSE,
  ERROR, FOCUS, META, OPEN, SAVE,
  SAVED, SUBMIT, UPDATE, TOGGLE_VALIDATING,
}
const typeIndex = invert(types)
const defaultFormState = {}

// Only keeping state we can not calculate. See derivedState().
const defaultState = immutable({
  blur: false, // When true the field is open but does not have focus.
  error: null, // String usually. Could be object for more complex error.
  fieldId: null, // String.
  focus: false, // When true the field is open and it has focus.
  initalValue: null, // Anything.
  meta: null, // Object.
  savedValue: null,
  saving: false, // Bool.
  validating: false, // Bool.
  value: null, // Anything.
})

function getFieldState(state, prefix) {
  return get(state, prefix, defaultState)
}

export default function reducer(_state = defaultFormState, action) {
  let prefix = action.meta && action.meta.prefix
  if (isString(prefix)) {
    prefix = prefix.split('.')
  }
  if (!prefix || !action.type || !typeIndex[action.type]) return _state

  // Used during rehydration.
  const formState = _state.asMutable ? _state : immutable(_state)
  // Get the state slice we need for this action.
  const state = getFieldState(formState, prefix)
  let newState = false
  // Ignore all actions that do not have a meta prefix that matches the one passed on creation.
  switch (action.type) {
    case CLEAR:
      newState = defaultState
      break
    case CLEAR_ERROR:
      newState = state.set('error', defaultState.error)
      break
    case CLOSE:
      // Should close also change value to initialValue?
      newState = state.merge({ blur: defaultState.blur, focus: defaultState.focus })
      break
    case ERROR:
      newState = state.merge({
        error: action.payload,
        saving: defaultState.saving,
        validating: defaultState.validating,
      })
      break
    case FOCUS:
      newState = state.set('blur', false)
      break
    case META:
      newState = state.set('meta', action.payload)
      break
    case OPEN:
      newState = state.merge({
        focus: true,
        fieldId: action.payload.fieldId,
        initalValue: state.initalValue || action.payload.initalValue,
        value: state.value || action.payload.initalValue,
      })
      break
    case SAVE:
      newState = state.set('saving', true)
      break
    case SUBMIT:
      newState = state.merge({
        blur: defaultState.blur,
        error: defaultState.error,
        focus: defaultState.focus,
        saving: true,
        value: action.payload || state.value,
      })
      break
    case SAVED:
      newState = state.merge({
        error: defaultState.error,
        saving: defaultState.saving,
        savedValue: action.payload,
      })
      break
    case TOGGLE_VALIDATING:
      newState = state.set('validating', !state.validating)
      break
    case UPDATE:
      newState = state.merge({
        ...state,
        error: defaultState.error,
        value: action.payload,
      })
      break
    default:
      return formState
  }
  return formState.setIn(prefix, newState)
}

// Validate function should return a string
// or object { message: String, suggestion: String, status: String }
export function derivedState(state, validate) {
  const errorVal = isFunction(validate) ? (validate(state.value) || state.help) : state.error
  const pristine = state.value === state.initalValue
  let status = errorVal ? 'error' : null
  if (errorVal && errorVal.status) {
    status = errorVal.status
  }
  const valid = !errorVal && !pristine
  if (valid) {
    status = 'success'
  }
  return state.merge({
    editing: state.focus && !pristine,
    dirty: !pristine,
    errorMessage: errorVal && errorVal.message ? errorVal.message : errorVal,
    // The field is open.
    hasError: !!errorVal,
    open: state.blur || state.focus,
    pristine,
    saved: pristine || state.value === state.savedValue,
    status,
    suggestion: errorVal && errorVal.suggestion ? errorVal.suggestion : undefined,
    valid,
  })
}
function getPrefix(formId, fieldId) {
  return [ formId, fieldId ]
}

export function getState(formState, formId, fieldId, validate) {
  const prefix = getPrefix(formId, fieldId)
  const fieldState = getFieldState(formState, prefix)
  return derivedState(fieldState, validate)
}
export function getValue(thing) {
  if (!thing) return thing
  if (thing.target && thing.target.value) {
    return thing.target.value
  }
  return thing
}
export function getActions(formId, fieldId) {
  function createAction(type, payload, error) {
    const meta = { prefix: getPrefix(formId, fieldId) }
    const action = {
      type,
      meta,
    }
    if (error) action.error = error
    if (!isUndefined(payload)) action.payload = payload
    return action
  }
  function blur(eventOrValue) {
    return createAction(BLUR, getValue(eventOrValue))
  }
  // The field has been closed.
  function close() {
    return createAction(CLOSE)
  }
  // When a user clicks on a field to edit it.
  function focus() {
    return createAction(FOCUS)
  }
  // Almost always the first thing that is called.
  function open(initalValue) {
    return createAction(OPEN, { fieldId, initalValue })
  }
  // On every change of field value.
  function update(eventOrValue) {
    return createAction(UPDATE, getValue(eventOrValue))
  }
  // Submit, close, save.
  function submit(eventOrValue) {
    return (dispatch, getStoreState) => {
      // @TODO Fix this getState().form BS. How do we known where the reducer is mounted?
      const value = getValue(eventOrValue) || getState(getStoreState().form, formId, fieldId).value
      return dispatch(createAction(SUBMIT, value))
    }
  }
  // Once on async validation. Once on result.
  function validating() {
    return createAction(TOGGLE_VALIDATING)
  }
  // Object of actions.
  return {
    // Close the field. Reset all values to default.
    clear: () => createAction(CLEAR),
    // Not sure when you would use this.
    clearError: () => createAction(CLEAR_ERROR),
    // Async error result. Sync errors should be calculated in container. See derivedState().
    error: (value) => createAction(ERROR, value, true),
    handleBlur: blur,
    handleChange: update,
    handleFocus: focus,
    handleOpen: open,
    handleSubmit: submit,
    // Set metadata about the editing process. If you need a place to put extra information.
    meta: (value) => createAction(META, value),
    onBlur: blur,
    onChange: update,
    onClose: close,
    onFocus: focus,
    onInput: update,
    onOpen: open,
    onSubmit: submit,
    // Saving to server.
    save: () => createAction(SAVE),
    // Has been saved on server.
    saved: () => createAction(SAVED),
    toggleValidating: validating,
    validating,
  }
}
