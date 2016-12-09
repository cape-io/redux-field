import test from 'tape'
import functions from 'lodash/functions'
import keys from 'lodash/keys'
import noop from 'lodash/noop'

import { mapDispatchToProps, mapStateToProps } from '../src/connectField'
import { emptyGetStateResult, formEvent, formHandler, fieldEvent } from './mock'

test('mapStateToProps mapDispatchToProps', (t) => {
  t.deepEqual(mapStateToProps({}, {}), { form: emptyGetStateResult })
  const acts = mapDispatchToProps(noop, {})
  t.deepEqual(keys(acts), ['fieldEvent', 'formEvent', 'formHandler'])
  t.deepEqual(functions(acts.formEvent), formEvent)
  t.deepEqual(functions(acts.formHandler), formHandler)
  t.deepEqual(functions(acts.fieldEvent), fieldEvent)
  t.end()
})
