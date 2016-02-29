import immutable from 'seamless-immutable'
import get from 'lodash/get'
import isFunction from 'lodash/isFunction'
import {
  CLEAR, CLEAR_ERROR, CLOSE, ERROR, INVALID, META, OPEN, SAVE, SAVED, VALID,
  BLUR, CHANGE, FOCUS, SUBMIT,
} from './actions'
// Only keeping state we can not calculate. See derivedState().
const defaultState = immutable({
  blur: false, // When true the field is open but does not have focus.
  error: null, // String usually. Could be object for more complex error.
  focus: false, // When true the field is open and it has focus.
  id: null, // String. Used as a unique key/id for this specific field value.
  initalValue: null, // Anything.
  invalid: {}, // index of invalid values.
  meta: null, // Anything.
  savedValue: null,
  saving: false, // Bool.
  valid: {}, // index of valid values.
  value: null, // Anything.
})
export const reducers = {
  [CLEAR]: () => defaultState,
  [CLEAR_ERROR]: (state) => state.set('error', defaultState.error),
  // Should close also change value to initialValue?
  [CLOSE]: (state) => state.merge({ blur: defaultState.blur, focus: defaultState.focus }),
  [ERROR]: (state, action) => state.merge({ error: action.payload }),
  [INVALID]: (state, action) =>
    state.setIn([ 'invalid', action.payload.key ], action.payload.value),
  [META]: (state, action) => state.set('meta', action.payload),
  [OPEN]: (state, action) => state.merge({
    focus: true,
    id: action.payload.id,
    initalValue: state.initalValue || action.payload.initalValue,
    value: state.value || action.payload.initalValue,
  }),
  [SAVE]: (state) => state.set('saving', true),
  [SAVED]: (state, action) => state.merge({
    error: defaultState.error,
    id: action.payload && action.payload.id || state.id,
    saving: defaultState.saving,
    savedValue: action.payload,
  }),
  [VALID]: (state, action) => state.setIn([ 'valid', action.payload.key ], action.payload.value),
  [BLUR]: (state, action) =>
    state.merge({ blur: true, focus: false, value: action.payload || state.value }),
  [CHANGE]: (state, action) => state.set('value', action.payload),
  [FOCUS]: (state) => state.merge({ blur: false, focus: true }),
  [SUBMIT]: (state, action) => state.merge({
    blur: defaultState.blur,
    error: defaultState.error,
    focus: defaultState.focus,
    saving: true,
    value: action.payload.value || state.value,
  }),
}
export default function reducer(_state = {}, action) {
  const prefix = action.meta && action.meta.prefix
  if (!prefix || !action.type) return _state
  // Used during rehydration.
  const formState = _state.asMutable ? _state : immutable(_state)
  // Get the state slice we need for this action.
  const state = get(formState, prefix, defaultState)
  const newState = isFunction(reducers[action.type]) ? reducers[action.type](state, action) : state
  return formState.setIn(prefix, newState)
}
