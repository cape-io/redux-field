import test from 'tape'
import { flow } from 'lodash'
import immutable from 'seamless-immutable'
import reducer, {
  close, onChange, onDragEnter, onDragLeave, onSubmit, open,
  saveProgress, savedProgress, selectFieldState,
} from '../src'
import {
  blurReducer, applyError, defaultState, dragEnterReducer, dragLeaveReducer, errorReducer,
  focusReducer, getDragCount, saveProgressReducer,
} from '../src/reducer'
import { store } from './mock'

const { dispatch, getState } = store

test('getDragCount', (t) => {
  t.equal(getDragCount(defaultState), 0)
  t.end()
})
function checkBlur(t, res, val) {
  t.equal(res.blur, true)
  t.equal(res.dragCount, 0)
  t.equal(res.focus, false)
  t.equal(res.isTouched, true)
  t.equal(res.value, val)
}
test('blurReducer', (t) => {
  const state = defaultState.merge({
    blur: false, dragCount: 1, focus: true, isTouched: false, value: 'foo' })
  const res = blurReducer(state, 'bar')
  checkBlur(t, res, 'bar')
  const res2 = blurReducer(state)
  checkBlur(t, res2, 'foo')
  t.end()
})
function checkError(t, res, val) {
  t.equal(res.error, val)
  t.ok(res.isTouched)
}
test('applyError', (t) => {
  const err = 'error msg'
  const res = applyError(immutable({}), err)
  checkError(t, res, err)
  checkError(t, applyError(res, 'junk'), 'junk')
  t.end()
})
test('errorReducer', (t) => {
  const err = 'error msg'
  const res = errorReducer(immutable({}), err)
  checkError(t, res, err)
  const res2 = errorReducer(immutable({}), { error: err, value: 'bas' })
  checkError(t, res2, err)
  checkBlur(t, res2, 'bas')
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
  dispatch(onDragEnter())
  t.equal(selectFieldState(getState()).dragCount, 1)
  t.end()
})
test('dragLeaveReducer', (t) => {
  const res = dragLeaveReducer(dragEnterReducer(defaultState))
  t.equal(res.dragCount, 0)
  t.equal(res.blur, true)
  t.equal(res.focus, false)
  t.equal(res.isTouched, true)
  t.equal(res.value, null)
  dispatch(onDragLeave())
  t.equal(selectFieldState(getState()).dragCount, 0)
  dispatch(onDragLeave())
  t.equal(selectFieldState(getState()).dragCount, 0)
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
  t.equal(saveProgressReducer(defaultState, 0).isSaving, true)
  function disp(action) {
    const state = reducer(undefined, action)
    t.equal(state.default.isSaving, true, 'isSaving')
    t.equal(state.default.savedProgress, 10, 'savedProgress')
  }
  savedProgress(null, 10)(disp)
  t.end()
})
test('saveProgress', (t) => {
  dispatch(saveProgress(null, { bytesTransferred: 256, totalBytes: 510 }))
  const state = getState()
  t.equal(state.form.default.savedProgress, 50)
  t.equal(state.form.default.isSaving, true)
  t.end()
})
