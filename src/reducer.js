import immutable from 'seamless-immutable'
import get from 'lodash/get'
import isArray from 'lodash/isArray'
import isFunction from 'lodash/isFunction'

import {
  CLEAR, CLEAR_ERROR, CLOSE, ERROR, INVALID, META, OPEN, SAVE, SAVED_PROGRESS, SAVED, VALID,
  BLUR, CHANGE, FOCUS, SUBMIT,
} from './actions'

// Only keeping state we can not calculate. See derivedState().
export const defaultState = immutable({
  blur: false, // When true the field is open but does not have focus.
  error: null, // String usually. Could be object for more complex error.
  focus: false, // When true the field is open and it has focus.
  id: null, // String. Used as a unique key/id for this specific field value.
  initialValue: null, // Anything.
  invalid: {}, // index of invalid values.
  meta: null, // Anything.
  savedProgress: 0, // Percentage Number 0-99.
  savedValue: null,
  saving: false, // Bool.
  touched: false,
  valid: {}, // index of valid values.
  value: null, // Anything.
})

export const reducers = {
  [CLEAR]: () => defaultState,
  [CLEAR_ERROR]: state => state.set('error', defaultState.error),
  // Should close also change initialValue?
  [CLOSE]: state =>
    state.merge({ blur: defaultState.blur, focus: defaultState.focus, touched: true }),
  [ERROR]: (state, payload) => state.merge({ error: payload }),
  [INVALID]: (state, payload) => state.setIn([ 'invalid', payload.key ], payload.value),
  [META]: (state, payload) => state.merge({ meta: payload, touched: true }, { deep: true }),
  [OPEN]: (state, payload = {}) => state.merge({
    focus: true,
    id: payload.id || defaultState.id,
    initialValue: state.initialValue || payload.initialValue || null,
    touched: true,
    value: state.value || payload.initialValue || null,
  }),
  [SAVE]: state => state.set('saving', true),
  [SAVED_PROGRESS]: (state, payload) => state.set('savedProgress', payload),
  [SAVED]: (state, payload) => state.merge({
    error: defaultState.error,
    id: payload && (payload.id || state.id),
    saving: defaultState.saving,
    savedProgress: defaultState.savedProgress,
    savedValue: payload,
  }),
  // This is another spot you could save meta data about a particular value.
  [VALID]: (state, payload) => state.setIn([ 'valid', payload.key ], payload.value),
  [BLUR]: (state, payload) =>
    state.merge({ blur: true, focus: false, touched: true, value: payload || state.value }),
  [CHANGE]: (state, payload) => state.merge({ touched: true, value: payload }),
  [FOCUS]: state => state.merge({ blur: false, focus: true, touched: true }),
  [SUBMIT]: (state, payload) => state.merge({
    blur: defaultState.blur,
    error: defaultState.error,
    focus: defaultState.focus,
    saving: true,
    value: payload || state.value,
  }),
}
export default function reducer(_state = {}, action) {
  if (!action.meta || !action.type || !isFunction(reducers[action.type])) return _state
  if (!isArray(action.meta.prefix)) throw new Error('Action must contain meta.prefix array.')
  // Used after rehydration.
  const state = _state.asMutable ? _state : immutable(_state)
  // Get the state slice we need for this action.
  const fieldState = get(state, action.meta.prefix, defaultState)
  return state.setIn(action.meta.prefix, reducers[action.type](fieldState, action.payload))
}
