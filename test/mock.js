import immutable from 'seamless-immutable'

export const emptyGetStateResult = immutable({
  blur: false,
  editing: false,
  error: null,
  errorMessage: null,
  dirty: false,
  focus: false,
  hasError: false,
  id: null,
  initialValue: null,
  invalid: null,
  isValid: false,
  meta: null,
  savedValue: null,
  saving: false,
  open: false,
  pristine: true,
  saved: false,
  status: null,
  suggestion: null,
  valid: null,
  value: null,
})
export const formEvent = [
  'onBlur', 'onChange', 'onFocus', 'onInput', 'onSubmit',
]
export const formHandler = [
  'handleBlur', 'handleChange', 'handleFocus', 'handleInput', 'handleSubmit',
]
export const fieldEvent = [
  'clear', 'clearError', 'close', 'error', 'invalid', 'meta', 'open', 'save', 'saved', 'valid',
]
export const nativeEvent = {
  nativeEvent: true,
  target: {
    value: 'Kumbaya',
  },
}
