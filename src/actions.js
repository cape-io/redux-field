import mapKeys from 'lodash/mapKeys'
// import isObject from 'lodash/isObject'
import mapValues from 'lodash/mapValues'
import memoize from 'lodash/memoize'
import partial from 'lodash/partial'

import { createAction, getProgress, mapPartial } from './utils'

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

// Record upload/save progress.
export const SAVED_PROGRESS = 'field/SAVED_PROGRESS'
export function savedProgress(prefix, valueOrEvent) {
  const action = createAction(SAVED_PROGRESS)
  const progress = getProgress(valueOrEvent)
  return dispatch =>
    progress % 5 === 0 && dispatch(action(prefix, progress)) || false
}

// Has been saved on server.
export const SAVED = 'field/SAVED'
export const saved = createAction(SAVED)
export const VALID = 'field/VALID'
export const valid = createAction(VALID)

// Redux-field events:
export const fieldEvent = {
  clear, clearError, close, error, invalid, meta, open, save, saved, savedProgress, valid,
}
export const getFieldEvents = mapPartial(fieldEvent)

// FORM & FOCUS EVENTS
export const BLUR = 'field/BLUR'
export const onBlur = createAction(BLUR)
// On every change of field value.
export const CHANGE = 'field/CHANGE'
export const onChange = createAction(CHANGE)
// When a user clicks on a field to edit it.
export const FOCUS = 'field/FOCUS'
export const onFocus = createAction(FOCUS)
// Alias of onChange.
export const onInput = onChange
// Submit, close, save.
export const SUBMIT = 'field/SUBMIT'
export const onSubmit = createAction(SUBMIT)

// Form and focus events:
export const formEvent = {
  onBlur, onChange, onFocus, onInput, onSubmit,
}
export const getFormEvents = mapPartial(formEvent)
export const formHandler = mapKeys(formEvent, (val, key) => key.replace('on', 'handle'))
export const getFormHandlers = mapPartial(formHandler)

function _getActions(prefix) {
  return {
    fieldEvent: getFieldEvents(prefix),
    formEvent: getFormEvents(prefix),
    formHandler: getFormHandlers(prefix),
  }
}
export const getActions = memoize(_getActions, prefix => prefix.toString())
