import immutable from 'seamless-immutable'

export const emptyGetStateResult = immutable({
  blur: false,
  error: null,
  focus: false,
  id: null,
  invalid: {},
  meta: null,
  savedValue: null,
  saving: false,
  valid: {},
  value: null,
  editing: false,
  dirty: false,
  errorMessage: null,
  hasError: false,
  initialValue: null,
  open: false,
  pristine: true,
  saved: false,
  status: null,
  suggestion: null,
  isValid: false,
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
