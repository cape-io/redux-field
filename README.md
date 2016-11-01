# redux-field 3.4.1

[![Build Status](https://travis-ci.org/cape-io/redux-field.svg?branch=master)](https://travis-ci.org/cape-io/redux-field)

For when you want to control individual form fields with redux. Think something like https://vitalets.github.io/x-editable/ for Redux.

Nothing should stop you from using the same reducer/actions for an entire form. However the main purpose of this is to save individual form fields as they change with a backend.

## `connectField({})(Component)`
### props
Wrapping a component with connectField will add a `form` property. It includes the following:
#### `form`
* `editing`: state.focus && !pristine,
* `dirty`: !pristine,
* `errorMessage`: errorVal && errorVal.message ? errorVal.message : errorVal,
* `hasError`: !!errorVal,
* `initialValue`: initVal,
* `invalidValue`: state.invalid[state.value] || null,
* `isValid`,
* `open`: state.blur || state.focus,
* `pristine`,
* `saved`: !pristine && state.value === state.savedValue,
* `status`: getStatus(errorVal, isValid),
* `suggestion`: errorVal && errorVal.suggestion ? errorVal.suggestion : null,
* `validValue`: state.valid[state.value] || null,

#### `fieldEvent`
* `clear`
* `clearError`
* `close`
* `error`
* `invalid`
* `meta`
* `open`
* `save`
* `saved`
* `savedProgress`
* `valid`

#### `formEvent`
* `onBlur`
* `onChange`
* `onFocus`
* `onInput`
* `onSubmit`

#### `formHandler`
* `handleBlur`
* `handleChange`
* `handleFocus`
* `handleInput`
* `handleSubmit`

## Selectors
* `selectForm(state)`: state.form
* `selectFieldState(state, prefix, selectFormState = selectForm)`: Please note that it will return defaultState if there is an invalid prefix.
* `getFieldState(state, props)`: `selectFieldState(state, props.prefix, props.selectForm)`
