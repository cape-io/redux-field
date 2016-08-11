## [3.3.0]
> 2016-08-11

* Add `getFieldValue(state, prefix, selectFormState, prop = 'value')` selector.
* Package updates

## [3.2.0]
> 2016-04-08

* Added `selectFieldState(state, prefix, selectFormState = selectForm)` selector that is used by `getFieldState(state, props)`.

## [3.1.3]
> 2016-04-05

* `META` action now sets `touched` as true and does a merge on `meta` instead of replacing it.
* `getMeta` requires third arg to be object before it will be merged.

## [3.1.2]
> 2016-03-30

* Allow extra meta to be included in actions.

## [3.1.1]
> 2016-03-30

* Pristine with error should return error.
* Added tests for `getErrorVal()`.

## [3.1.0]
> 2016-03-28

* Add `touched` state property.

## [3.0.0]

Should be an easy change for most.

* Breaking change: `derivedState()` returns `invalidValue` and `validValue` instead of `invalid` and `valid`. This allows the entire state of invalid and valid to be used even when there is no value.

## [2.2.0]
> 2016-03-15

* Added `savedProgress` action and field state property.

## [2.1.3]
> 2016-03-13

* Fix a bug where `open()` fails when not sent a payload. Thinking the use of `id` state value is a mistake.

## [2.0.0]
> 2016-03-01

* Actions are now split into groups. `fieldEvent` contains all actions related to field state. `formEvent` are form and focus events like `onChange`. `formHandler` a clone of `formEvent` where the keys replace `on` with `handle` like `handleBlur` instead of `onBlur`.
* First arg to actions is a `prefix` array. Second arg is the `payload`.
* Removed concept of `formId` and `fieldId` from everything in favor of a singular `prefix` array prop.
* Added `valid` and `invalid` actions and related state keys. Should be used to store async results to values. The `getState` function will look in invalid for a key matching `value`. If it finds one it will use that as error.
* Reducer is now exported as `fieldReducer` instead of default.
* The `validate` props function is only called when `dirty`.
* The `submit` action now expects the value to be passed as its payload. Same as `onChange`.

## [1.4.0]
> 2016-02-23

* reducer on `SAVED` will hoist a payload `id` prop to the field state. It will be left as-is to be saved to `savedValue`. The purpose is to allow the server to set a unique field id.
* `saved()` action now accepts payload and value.
* Update `value` on `BLUR` if one is given.

## [1.3.0]
> 2016-02-19

* `initialValue` can be sent as prop to the `Component` of `conntectField()(Component)`.

## [1.2.0]
> 2016-02-16

* `connectField()` accepts `selectForm(state){ return state.fields }` custom function for selecting form slice.
* BUG: Fix missing BLUR handler in reducer.
* BUG: Fix actions handling empty `event.target.value`.

## [1.1.0]
> 2016-02-13

Added `connectField({})(Component)` to wrap state and actions to a field component.

## [1.0.0]
> 2016-02-11

Initial Release
