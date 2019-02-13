import {
  constant, curry, mapKeys, mapValues, replace, set,
} from 'lodash/fp'
import { callWith } from 'understory'
import {
  createPrefix, createPayload, getProgress,
} from './utils'

const basicAction = curry((type, prefix) => ({
  type, meta: { prefix: createPrefix(prefix) },
}))
const noopAction = curry((type, prefix) => constant(basicAction(type, prefix)))
const createAction = curry((type, prefix, payload) => set(
  'payload', createPayload(payload), basicAction(type, prefix),
))

// Close the field. Reset all values to default.
export const CLEAR = 'field/CLEAR'
export const clear = basicAction(CLEAR)
// Reset error to null.
export const CLEAR_ERROR = 'field/CLEAR_ERROR'
export const clearError = basicAction(CLEAR_ERROR)
// The field has been closed.
export const CLOSE = 'field/CLOSE'
export const close = basicAction(CLOSE)

// Async error result. Sync errors should be calculated in container. See derivedState().
export const ERROR = 'field/ERROR'
export const error = createAction(ERROR)
// Set values that are known invalid.
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

// Record upload/save progress.
export const SAVED_PROGRESS = 'field/SAVED_PROGRESS'
export const saveProgress = curry((prefix, valueOrEvent) => createAction(
  SAVED_PROGRESS, prefix, getProgress(valueOrEvent),
))

export const savedProgress = curry((prefix, valueOrEvent) => {
  const action = saveProgress(prefix, valueOrEvent)
  const progress = action.payload
  return dispatch => (progress % 5 === 0 && dispatch(action(prefix, progress))) || false
})

// Similar to invalid. Save that a value is valid.
export const VALID = 'field/VALID'
export const valid = createAction(VALID)

// Redux-field events:
export const fieldEvent = {
  clear, clearError, close, error, invalid, meta, open, save, saved, savedProgress, valid,
}

export const applyPrefix = actions => prefix => mapValues(callWith(prefix), actions)
export const getFieldEvents = applyPrefix(fieldEvent)

// FORM & FOCUS EVENTS
export const BLUR = 'field/BLUR'
export const onBlur = createAction(BLUR)

// On every change of field value.
export const CHANGE = 'field/CHANGE'
export const onChange = createAction(CHANGE)
export const onInput = onChange

export const DRAG_ENTER = 'field/DRAG_ENTER'
export const onDragEnter = createAction(DRAG_ENTER)

export const DRAG_LEAVE = 'field/DRAG_LEAVE'
export const onDragLeave = createAction(DRAG_LEAVE)

// When a user clicks on a field to edit it.
export const FOCUS = 'field/FOCUS'
export const onFocus = noopAction(FOCUS)

// Submit, close, save.
export const SUBMIT = 'field/SUBMIT'
// @TODO Create timer to trigger error if doesn't submit.
export const onSubmit = createAction(SUBMIT)

// Form and focus events:
export const formEvent = {
  onBlur, onChange, onFocus, onInput, onSubmit,
}

export const getFormEvents = applyPrefix(formEvent)
export const formHandler = mapKeys(replace('on', 'handle'), formEvent)
export const getFormHandlers = applyPrefix(formHandler)

// Save and reuse these.
export const createActions = prefix => ({
  fieldEvent: getFieldEvents(prefix),
  formEvent: getFormEvents(prefix),
  formHandler: getFormHandlers(prefix),
})
export const actions = createActions('default')
export const actionTypes = {
  CLEAR,
  CLEAR_ERROR,
  CLOSE,
  ERROR,
  INVALID,
  META,
  OPEN,
  SAVE,
  SAVED,
  SAVED_PROGRESS,
  VALID,
  BLUR,
  CHANGE,
  DRAG_ENTER,
  DRAG_LEAVE,
  FOCUS,
  SUBMIT,
}
