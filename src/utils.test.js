// import { flow } from 'lodash/fp'
import {
  eventProg, fireProg, getProgress, progPercent,
} from './utils'
/* globals describe test expect */

// test('getProgress', (t) => {
//   t.equal(getProgress({ bytesTransferred: 0, totalBytes: 510 }), 0, 'zero progress')
//   t.end()
// })

describe('progPercent', () => {
  test('divide and round', () => {
    expect(progPercent([50, 100])).toBe(50)
    expect(progPercent([100, 510])).toBe(20)
  })
})
describe('eventProg', () => {
  test('event handling', () => {
    expect(eventProg({ loaded: 0, total: 10 })).toBe(0)
    expect(eventProg({ loaded: 50.4, total: 100 })).toBe(50)
    expect(eventProg({ loaded: 256, total: 510 })).toBe(50)
    expect(eventProg({ loaded: 100, total: 510 })).toBe(20)
  })
})
describe('fireProg', () => {
  test('firebase handling', () => {
    expect(fireProg({ bytesTransferred: 256, totalBytes: 510 })).toBe(50)
    expect(fireProg({ bytesTransferred: 100, totalBytes: 510 })).toBe(20)
  })
})

describe('getProgress', () => {
  test('converts string to number and round down', () => {
    expect(getProgress('10.2')).toBe(10)
    expect(getProgress('2.7')).toBe(2)
  })
  test('number round down', () => {
    expect(getProgress(10.2)).toBe(10)
    expect(getProgress(2.7)).toBe(2)
  })
  test('event handling', () => {
    expect(getProgress({ loaded: 50.4, total: 100 })).toBe(50)
    expect(getProgress({ loaded: 256, total: 510 })).toBe(50)
    expect(getProgress({ loaded: 100, total: 510 })).toBe(20)
  })
  test('firebase handling', () => {
    expect(getProgress({ bytesTransferred: 256, totalBytes: 510 })).toBe(50)
    expect(getProgress({ bytesTransferred: 100, totalBytes: 510 })).toBe(20)
  })
  test('zero progress', () => {
    expect(getProgress('0.7')).toBe(0)
    expect(getProgress(0.7)).toBe(0)
    expect(getProgress({ loaded: 0, total: 510 })).toBe(0)
    expect(getProgress({ bytesTransferred: 0, totalBytes: 510 })).toBe(0)
  })
})
