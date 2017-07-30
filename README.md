# redux-field 5.1.1

[![Build Status](https://travis-ci.org/cape-io/redux-field.svg?branch=master)](https://travis-ci.org/cape-io/redux-field)

For when you want to control individual form fields with redux. Think something like https://vitalets.github.io/x-editable/ for Redux.

Nothing should stop you from using the same reducer/actions for an entire form.

## Add reducer to redux.

```javascript
import fieldReducer from 'redux-field'

const reducers = combineReducers({ form: fieldReducer })
const store = createStore(reducers)
```

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

### Actions

#### `fieldEvent`

* `clear` - Close the field. Reset all values to default.
* `clearError` - Reset `error` to `null`.
* `close` - The field has been "closed". Allows you do something like display the field in its finished form instead of as an input.
* `error` - Async error result. Sync errors should be calculated in container. See `derivedState()`.
* `invalid` - Set values that are known invalid. Useful to keep track of previous results from API calls. Makes feedback faster and prevents unnecessary requests..
* `meta` - Set metadata about the editing process or field. Here if you need a place to put extra information.
* `open` - The first thing that is called to initiate editing of a field. Toggle the preview and input displays of a field.
* `save` - When an async request has been made that is saving the updated value to the server.
* `saved` - Current value has been saved.
* `savedProgress` - Record upload/save progress. If saving a file and you want to keep track of how much has been uploaded.
* `valid` - Similar to `invalid`. Save that a value is valid. Probably the result of an async request. Could also store temporary meta info about the value here.

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
