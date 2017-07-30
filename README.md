# redux-field 5.1.1

[![Build Status](https://travis-ci.org/cape-io/redux-field.svg?branch=master)](https://travis-ci.org/cape-io/redux-field)

For when you want to control individual form fields with redux. Think something like https://vitalets.github.io/x-editable/ for Redux.

Nothing should stop you from using the same reducer/actions for an entire form.

## Usage

```javascript
import fieldReducer from 'redux-field'

const reducers = combineReducers({ form: fieldReducer })
const store = createStore(reducers)
```

### props

#### Reducer State

* `blur`: `false` - When `true` the field is open but does not have focus or is inactive.
* `dragCount`: `0` - Needed for nested divs to keep track of active `focus` status.
* `error`: `null` - String usually. Could be object for more complex error if you wanted.
* `focus`: `false` - When true the field is open and it has focus.
* `id`: `null` - String. Used as a unique key/id for this specific field value. So the `prefix` component prop can stay the same but the field changes. Editing an entity (`prefix` is entity id) one field at a time (`id` is field id) is a good example use for this.
* `initialValue`: `null` - The value when the field was initialized. Would be the saved (server) value.
* `invalid`: `{}` - Index of known invalid values. If checking against an API for validity this will persist previously found invalid results. Up to the developer to decide how it to represent the field value as a key. The invalid value is an error string or other data needed to render the error message/notice.
* `meta`: `null` - Any value you want to keep track of related to field state.
* `savedProgress`: `0` - Percentage. Integer between 0-99.
* `savedValue`: `null` - If the backend changes the value and you want to show the difference you can place that updated value here.
* `isSaving`: `false` - Is there an active request attempting to save the field value?
* `isTouched`: `false` - Have there been interactions with the field.
* `valid`: `{}` - Index of known valid values. Responses from a backend or API.
* `value`: `null` - The value of the field goes here. Probably the most important state property.

#### Calculated Props

* `errorMessage`: The error message string.
* `hasError`: There is an error and/or an error message is available.
* `initialValue`: The initial value.
* `invalidValue`: Result in the `invalid` index for the current field `value`.
* `isEditing`: User is editing the field value. There is focus and it's not pristine.
* `isClosed`: The field is closed.
* `isDirty`: Field `value` does not match the initial value.
* `isValid`: An update (dirty) `value` that does not have an error.
* `isOpen`: The field has `blur` or `focus`.
* `isPristine`: The current field `value` matches the initial value.
* `isSaved`: The savedValue is the same as the current field value. Might need a better name.
* `status`: A machine text string representing status. (`success`, `error`) Can store `status` property to the `error` index for this value to customize.
* `suggestion`: When there is a `suggestion` property on the `error` index for current field `value`.
* `validValue`: The value of the `valid` index related to the current field `value`.

### Actions

#### `formEvent`

Handlers for input field triggers.

* `onBlur` - When the input has been exited.
* `onChange` - Every time value changes.
* `onDragEnter` - Drag and drop enter.
* `onDragLeave` - Drag and drop leave.
* `onFocus` - When the input has (been clicked on) focus.
* `onInput` - Alias of `onChange`.
* `onSubmit` - Return key inside a form.
* _onDrop_ - Not implemented. Best to handle this yourself and use an `onChange` or other to update state as needed. Submit an issue if you disagree and have an idea of what the reducer should do.

#### `fieldEvent`

Actions related to the field and/or its container.

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

#### `formHandler`

Same as `formEvent` but `on` replaced with `handle`. (`handleBlur, handleChange, handleDragEnter, handleDragLeave, handleFocus, handleInput, handleSubmit`)

## Selectors

* `selectForm(state)`: state.form
* `selectFieldState(state, prefix, selectFormState = selectForm)`: Please note that it will return defaultState if there is an invalid prefix.
* `getFieldState(state, props)`: `selectFieldState(state, props.prefix, props.selectForm)`
