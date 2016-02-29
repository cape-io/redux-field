## [2.0.0]
> 2016-02-28

* Actions are now split into groups. `fieldEvent` contains all actions related to field state. `formEvent` are form and focus events like `onChange`. `formHandler` a clone of `formEvent` where the keys replace `on` with `handle` like `handleBlur` instead of `onBlur`.
* 

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
