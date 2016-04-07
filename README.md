# redux-field
[![Build Status](https://travis-ci.org/cape-io/redux-field.svg?branch=master)](https://travis-ci.org/cape-io/redux-field)

For when you want to control individual form fields with redux. Think something like https://vitalets.github.io/x-editable/ for Redux.

Nothing should stop you from using the same reducer/actions for an entire form. However the main purpose of this is to save individual form fields as they change with a backend.

## `connectField`
### props
* `fieldEvent` (clear, clearError, close, error, invalid, meta, open, save, saved, savedProgress, valid)
* `formEvent` (onBlur, onChange, onFocus, onInput, onSubmit)
* `formHandler` (handleBlur, handleChange, handleFocus, handleInput, handleSubmit)
