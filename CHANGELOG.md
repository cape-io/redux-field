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
