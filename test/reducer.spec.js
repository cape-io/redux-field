import test from 'tape'
import { flow } from 'lodash'
import {
  close, fieldReducer as reducer, onChange, onDragEnter, onDragLeave, onSubmit, open, savedProgress,
} from '../src'
import {
  blurReducer, defaultState, dragEnterReducer, dragLeaveReducer, focusReducer, getDragCount,
} from '../src/reducer'
import { store } from './mock'

const { dispatch, getState } = store

test('getDragCount', (t) => {
  t.equal(getDragCount(defaultState), 0)
  t.end()
})
test('blurReducer', (t) => {
  const state = defaultState.merge({ blur: false, focus: true, isTouched: false, value: 'foo' })
  const res = blurReducer(state, 'bar')
  t.equal(res.blur, true)
  t.equal(res.focus, false)
  t.equal(res.isTouched, true)
  t.equal(res.value, 'bar')
  const res2 = blurReducer(state)
  t.equal(res2.value, 'foo')
  t.end()
})
test('focusReducer', (t) => {
  const state = defaultState.merge({ blur: true, focus: false, isTouched: false })
  const res = focusReducer(state)
  t.equal(res.blur, false)
  t.equal(res.focus, true)
  t.equal(res.isTouched, true)
  const res2 = blurReducer(res)
  t.equal(res2.blur, true)
  t.equal(res2.focus, false)
  t.end()
})
test('dragEnterReducer', (t) => {
  const res = dragEnterReducer(defaultState)
  t.equal(res.blur, false)
  t.equal(res.focus, true)
  t.equal(res.isTouched, true)
  t.equal(res.dragCount, 1)
  const res2 = dragEnterReducer(res)
  t.equal(res2.focus, true)
  t.equal(res2.dragCount, 2)
  dispatch(undefined, onDragEnter())
  t.equal(getState().dragCount, 1)
  t.end()
})
test('dragLeaveReducer', (t) => {
  const res = dragLeaveReducer(defaultState)
  t.equal(res.dragCount, -1)
  t.equal(res.blur, true)
  t.equal(res.focus, false)
  t.equal(res.isTouched, true)
  t.equal(res.value, null)
  dispatch(undefined, onDragLeave())
  t.equal(getState().dragCount, -1)
  const res2 = flow(dragEnterReducer, dragEnterReducer, dragLeaveReducer)(defaultState)
  t.equal(res2.blur, false)
  t.equal(res2.focus, true)
  t.equal(res2.isTouched, true)
  t.equal(res2.dragCount, 1)
  const res3 = dragLeaveReducer(res2)
  t.equal(res3.dragCount, 0)
  t.equal(res3.blur, true)
  t.equal(res3.focus, false)
  t.equal(res3.isTouched, true)
  t.equal(res3.value, null)
  t.end()
})
test('reducer', (t) => {
  let state = reducer()
  t.ok(state.asMutable)
  t.deepEqual(state, {})
  state = reducer(state, onChange(null, 'jo'))
  t.deepEqual(state.default, defaultState.merge({ isTouched: true, value: 'jo' }), 'onChange')
  state = reducer(state, onSubmit(null, 'joy'))
  t.deepEqual(
    state.default, defaultState.merge({ isTouched: true, value: 'joy', isSaving: true }), 'onSubmit'
  )
  t.end()
})
test('open', (t) => {
  const action = open()
  let state = reducer(undefined, action)
  function get(id) { return state.default[id] }
  t.equal(get('focus'), true, 'focus')
  t.equal(get('initialValue'), null, 'initialValue')
  t.equal(get('value'), null, 'value')
  t.equal(get('isTouched'), true, 'isTouched')
  state = reducer(undefined, open(null, { initialValue: 'foo' }))
  t.equal(get('focus'), true, 'focus')
  t.equal(get('initialValue'), 'foo', 'initialValue')
  t.equal(get('value'), 'foo', 'value')
  t.equal(get('isTouched'), true, 'isTouched')
  state = reducer(state, close())
  t.equal(get('focus'), false, 'focus')
  t.equal(get('blur'), false, 'blur')
  t.equal(get('isTouched'), true, 'isTouched')
  state = reducer(state, open(null, { initialValue: 'bar' }))
  t.equal(get('focus'), true, 'focus')
  t.equal(get('value'), 'foo', 'value')
  t.equal(get('initialValue'), 'foo', 'initialValue')
  t.equal(get('isTouched'), true, 'isTouched')
  t.end()
})
test('savedProgress', (t) => {
  t.equal(defaultState.savedProgress, 0, 'defaultState')
  function dispatch(action) {
    const state = reducer(undefined, action)
    t.equal(state.default.savedProgress, 10, 'savedProgress')
  }
  savedProgress(null, 10)(dispatch)
  t.end()
})
