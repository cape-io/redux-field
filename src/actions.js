import partialRight from 'lodash/partial'
import reduce from 'lodash/reduce'
import set from 'lodash/set'

import { createAction } from './utils'

// Close the field. Reset all values to default.
export const CLEAR = 'field/CLEAR'
export const clear = createAction(CLEAR, false)
// Not sure when you would use this.
export const CLEAR_ERROR = 'field/CLEAR_ERROR'
export const clearError = createAction(CLEAR_ERROR, false)
// The field has been closed.
export const CLOSE = 'field/CLOSE'
export const close = createAction(CLOSE, false)
// Async error result. Sync errors should be calculated in container. See derivedState().
export const ERROR = 'field/ERROR'
export const error = createAction(ERROR)
export const INVALID = 'field/INVALID'
export const invalid = createAction(INVALID)
// Set metadata about the editing process. If you need a place to put extra information.
export const META = 'field/META'
export const meta = createAction(META)
// Almost always the first thing that is called.
export const OPEN = 'field/OPEN'
export const open = createAction(OPEN)
// Saving to server.
export const SAVE = 'field/SAVE'
export const save = createAction(SAVE)
// Has been saved on server.
export const SAVED = 'field/SAVED'
export const saved = createAction(SAVED)
export const VALID = 'field/VALID'
export const valid = createAction(VALID)

// FORM & FOCUS EVENTS
export const BLUR = 'field/BLUR'
export const onBlur = createAction(BLUR)
// On every change of field value.
export const CHANGE = 'field/CHANGE'
export const onChange = createAction(CHANGE)
// When a user clicks on a field to edit it.
export const FOCUS = 'field/FOCUS'
export const onFucus = createAction(FOCUS)
// Alias of onChange.
export const onInput = onChange
// Submit, close, save.
export const SUBMIT = 'field/SUBMIT'
export const onSubmit = createAction(SUBMIT)

export function getActions(...args) {
  // Form and focus events:
  const form = [
    'onBlur', 'onChange', 'onFocus', 'onInput', 'onSubmit',
  ]
  // Redux-field events:
  const field = [
    'clear', 'clearError', 'close', 'error', 'invalid', 'meta', 'open', 'save', 'saved', 'valid',
  ]
  function wrap(func) {
    return partialRight(func, ...args)
  }
  // Object of actions.
  return {
    fieldEvent: reduce(field, (result, funcId) => set(result, funcId, wrap(funcId)), {}),
    formEvent: reduce(form, (result, funcId) => set(result, funcId, wrap(funcId)), {}),
    formHandler: reduce(form, (result, funcId) =>
      set(result, funcId.replace('on', 'handle'), wrap(funcId)), {}),
  }
}