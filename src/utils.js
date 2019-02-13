import {
  at, curry, divide, every, flow,
  isArray, isEmpty, isNumber, isObject, isString, mapValues, multiply,
  parseInt, round, spread, stubFalse,
} from 'lodash/fp'
import { callWith, overBranch } from 'understory'
import { getPayload } from 'cape-redux'

export const PREFIX = 'default'

export function createPrefix(prefix) {
  if (isString(prefix)) {
    return prefix.split('.')
  }
  if (isArray(prefix) && !isEmpty(prefix)) {
    return prefix
  }
  if (isObject(prefix) && prefix.fieldId && prefix.formId) {
    return [prefix.formId, prefix.fieldId]
  }
  return [PREFIX]
}

export function preventDefault(event) {
  if (event && event.preventDefault) event.preventDefault()
}
export function createPayload(payload) {
  if (!payload) return payload
  preventDefault(payload)
  if (payload.target && payload.nativeEvent) {
    return payload.target.value || ''
  }
  return getPayload(payload)
}

export const progPercent = flow(spread(divide), multiply(100), round)
export const progress = (progressKey, totalKey) => flow(
  at([progressKey, totalKey]),
  overBranch(every(isNumber), progPercent, stubFalse),
)
// parseInt((progress / total) * 100, 10)
export const eventProg = progress('loaded', 'total')
export const fireProg = progress('bytesTransferred', 'totalBytes')
export function objProg(status) {
  let res = eventProg(status)
  if (res === false) res = fireProg(status)
  if (res === false) throw new Error('Unable to get progress from event object.')
  return res
}
export const getProgress = overBranch(isObject, objProg, parseInt(10))

export const mapPartial = curry((obj, arg) => mapValues(callWith(arg), obj))
