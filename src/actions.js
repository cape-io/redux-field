import { flow, mapKeys, memoize, nthArg } from 'lodash'

import { createAction as actionCreate } from 'cape-redux'

import { createAction, getMeta, getProgress, mapPartial } from './utils'

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
    (progress % 5 === 0 && dispatch(action(prefix, progress))) || false
}
export const saveProgress = actionCreate(SAVED_PROGRESS, flow(nthArg(1), getProgress), getMeta)

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
export const DRAG_ENTER = 'field/DRAG_ENTER'
export const onDragEnter = createAction(DRAG_ENTER)
export const DRAG_LEAVE = 'field/DRAG_LEAVE'
export const onDragLeave = createAction(DRAG_LEAVE)
// When a user clicks on a field to edit it.
export const FOCUS = 'field/FOCUS'
export const onFocus = createAction(FOCUS)
// Alias of onChange.
export const onInput = onChange
// Submit, close, save.
export const SUBMIT = 'field/SUBMIT'
// @TODO Create timer to trigger error if doesn't submit.
export const onSubmit = createAction(SUBMIT)

// Form and focus events:
export const formEvent = {
  onBlur, onChange, onFocus, onInput, onSubmit,
}
export const getFormEvents = mapPartial(formEvent)
export const formHandler = mapKeys(formEvent, (val, key) => key.replace('on', 'handle'))
export const getFormHandlers = mapPartial(formHandler)

export const getActions = memoize(
  prefix => ({
    fieldEvent: getFieldEvents(prefix),
    formEvent: getFormEvents(prefix),
    formHandler: getFormHandlers(prefix),
  }),
  prefix => prefix.toString()
)
