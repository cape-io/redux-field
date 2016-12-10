import immutable from 'seamless-immutable'
import { flow, get, isArray, property } from 'lodash'
import { gte } from 'lodash/fp'
import { condId } from 'cape-lodash'
import { createReducer, noReducerOfType } from 'cape-redux'
import {
  CLEAR, CLEAR_ERROR, CLOSE, ERROR, INVALID, META, OPEN, SAVE, SAVED_PROGRESS, SAVED, VALID,
  BLUR, CHANGE, DRAG_ENTER, DRAG_LEAVE, FOCUS, SUBMIT,
} from './actions'

// Only keeping state we can not calculate. See derivedState().
export const defaultState = immutable({
  blur: false, // When true the field is open but does not have focus.
  dragCount: 0, // For keeping track of entering children but maintaining focus.
  error: null, // String usually. Could be object for more complex error.
  focus: false, // When true the field is open and it has focus.
  id: null, // String. Used as a unique key/id for this specific field value.
  initialValue: null, // Anything.
  invalid: {}, // index of invalid values.
  meta: null, // Anything.
  savedProgress: 0, // Percentage Number 0-99.
  savedValue: null,
  isSaving: false, // Bool.
  isTouched: false,
  valid: {}, // index of valid values.
  value: null, // Anything.
})
export const getDragCount = property('dragCount')

export const blurReducer = (state, payload) =>
  state.merge({ blur: true, focus: false, isTouched: true, value: payload || state.value })
export const focusReducer = state => state.merge({ blur: false, focus: true, isTouched: true })
export const dragEnterReducer = flow(focusReducer,
  state => state.set('dragCount', state.dragCount + 1)
)

export const dragLeaveReducer = flow(
  state => state.set('dragCount', state.dragCount - 1),
  condId([flow(getDragCount, gte(0)), blurReducer])
)
export const reducers = {
  [CLEAR]: () => defaultState,
  [CLEAR_ERROR]: state => state.set('error', defaultState.error),
  // Should close also change initialValue?
  [CLOSE]: state =>
    state.merge({ blur: defaultState.blur, focus: defaultState.focus, isTouched: true }),
  [ERROR]: (state, payload) => state.merge({ error: payload }),
  [INVALID]: (state, payload) => state.setIn(['invalid', payload.key], payload.value),
  [META]: (state, payload) => state.merge({ meta: payload, isTouched: true }, { deep: true }),
  [OPEN]: (state, payload = {}) => state.merge({
    focus: true,
    id: payload.id || defaultState.id,
    initialValue: state.initialValue || payload.initialValue || null,
    isTouched: true,
    value: state.value || payload.initialValue || null,
  }),
  [SAVE]: state => state.set('isSaving', true),
  [SAVED_PROGRESS]: (state, payload) => state.set('savedProgress', payload),
  [SAVED]: (state, payload) => state.merge({
    error: defaultState.error,
    id: get(payload, 'id', state.id),
    isSaving: defaultState.isSaving,
    savedProgress: defaultState.savedProgress,
    savedValue: get(payload, 'value', state.value),
  }),
  // This is another spot you could save meta data about a particular value.
  [VALID]: (state, payload) => state.setIn(['valid', payload.key], payload.value),
  [BLUR]: blurReducer,
  [CHANGE]: (state, payload) => state.merge({ isTouched: true, value: payload }),
  [DRAG_ENTER]: dragEnterReducer,
  [DRAG_LEAVE]: dragLeaveReducer,
  [FOCUS]: focusReducer,
  [SUBMIT]: (state, payload) => state.merge({
    blur: defaultState.blur,
    error: defaultState.error,
    focus: defaultState.focus,
    isSaving: true,
    value: payload || state.value,
  }),
}
const options = { makeImmutable: true, skipErrors: false }
export const fieldReducer = createReducer(reducers, defaultState, options)
export function asImmutable(state) {
  return state.asMutable ? state : immutable(state)
}
export default function reducer(state = immutable({}), action) {
  if (noReducerOfType(reducers)(action)) return state
  if (!isArray(action.meta.prefix)) throw new Error('Action must contain meta.prefix array.')
  // Get the state slice we need for this action.
  const oldFieldState = get(state, action.meta.prefix)
  const newFieldState = fieldReducer(oldFieldState, action)
  if (oldFieldState === newFieldState) return state
  return asImmutable(state).setIn(action.meta.prefix, newFieldState)
}
