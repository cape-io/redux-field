import {
  add, defaultTo, flow, get, getOr, gte, isArray, isEmpty, isUndefined,
  merge, negate, pick, set, update,
} from 'lodash/fp'
import { overBranch, subtrahend } from 'understory'
import { mergeWith, setIn } from 'prairie'
import { createReducer, noReducerOfType } from 'cape-redux'
import {
  CLEAR, CLEAR_ERROR, CLOSE, ERROR, INVALID, META, OPEN, SAVE, SAVED_PROGRESS, SAVED, VALID,
  BLUR, CHANGE, DRAG_ENTER, DRAG_LEAVE, FOCUS, SUBMIT,
} from './actions'

// Only keeping state we can not calculate. See derivedState().
export const defaultState = {
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
}

export const resetFields = fields => mergeWith(pick(fields, defaultState))

export const getDragCount = get('dragCount')

export const setFocus = mergeWith({ blur: false, focus: true, isTouched: true })
export const setClose = resetFields(['blur', 'focus'])

export const saving = set('isSaving', true)
export const isNewValue = (state, payload) => (!isUndefined(payload) && payload !== state.value)
export const setValue = overBranch(isNewValue, setIn('value'))
export const touched = overBranch(negate(get('isTouched')), set('isTouched', true))
export const changeReducer = flow(setValue, touched)

export const blurReducer = flow(
  changeReducer,
  resetFields(['dragCount', 'focus']),
  set('blur', true),
)

export const closeReducer = flow(setClose, touched)

export const applyError = flow(setIn('error'), touched)

export const clearError = set('error', defaultState.error)
export const errorReducer = (state, payload) => {
  if (payload.error && payload.value) {
    return setValue(applyError(state, payload.error), payload.value)
  }
  return applyError(state, payload)
}

export const dragEnterReducer = flow(
  setFocus,
  update('dragCount', add(1)),
)

export const dragLeaveReducer = flow(
  update('dragCount', subtrahend(1)),
  overBranch(flow(getDragCount, gte(0)), blurReducer),
)

// Can not overwrite value.
export const openReducer = (state, payload = {}) => ({
  ...state,
  focus: true,
  id: defaultTo(defaultTo(null, state.id), payload.id),
  initialValue: defaultTo(
    defaultTo(defaultTo(null, state.value), state.initialValue),
    payload.initialValue,
  ),
  isTouched: true,
  value: defaultTo(defaultTo(null, payload.initialValue), state.value),
})

export const setSaved = resetFields(['error', 'isSaving', 'savedProgress'])

export const savedReducer = (state, payload) => ({
  ...setSaved(state),
  id: getOr(state.id, 'id', payload),
  initialValue: state.value,
  savedValue: getOr(state.value, 'value', payload),
  value: getOr(state.value, 'value', payload),
})
export const saveProgressReducer = flow(setIn('savedProgress'), saving)

export const submitReducer = flow(
  setValue,
  setClose,
  saving,
)
export const metaReducer = ({ meta, ...state }, payload) => ({
  ...state,
  isTouched: true,
  meta: merge(meta, payload),
})

export const reducers = {
  [CLEAR]: () => defaultState,
  [CLEAR_ERROR]: clearError,
  // Should close also change initialValue?
  [CLOSE]: closeReducer,
  [ERROR]: errorReducer,
  [INVALID]: (state, payload) => set(['invalid', payload.key], payload.value, state),
  [META]: metaReducer,
  [OPEN]: openReducer,
  [SAVE]: saving,
  [SAVED_PROGRESS]: saveProgressReducer,
  [SAVED]: savedReducer,
  // This is another spot you could save meta data about a particular value.
  [VALID]: (state, payload) => set(['valid', payload.key], payload.value, state),
  [BLUR]: blurReducer,
  [CHANGE]: changeReducer,
  [DRAG_ENTER]: dragEnterReducer,
  [DRAG_LEAVE]: dragLeaveReducer,
  [FOCUS]: setFocus,
  [SUBMIT]: submitReducer,
}

export const fieldReducer = createReducer(reducers, defaultState, { skipErrors: false })
export default function reducer(state = {}, action) {
  if (noReducerOfType(reducers)(action)) return state
  if (!isArray(action.meta.prefix) || isEmpty(action.meta.prefix)) {
    throw new Error('Action must contain meta.prefix array.')
  }
  // Get the state slice we need for this action.
  const oldFieldState = get(action.meta.prefix, state)
  const newFieldState = fieldReducer(oldFieldState, action)
  if (oldFieldState === newFieldState) return state
  // console.log(get('value', oldFieldState), newFieldState.value)
  return set(action.meta.prefix, newFieldState, state)
}
