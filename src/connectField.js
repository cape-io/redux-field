import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { getActions, getState } from './index'

function _selectForm(state) {
  return state.form
}
// This gets state and actions for a specific field. That is all.
// The formId and fieldId can be sent via init as an object or with props on each instance.
export default function connectField(options = {}) {
  const { selectForm = _selectForm } = options
  function getInfo(ownProps) {
    return {
      formId: ownProps.formId || options.formId || 'default',
      fieldId: ownProps.field.id || ownProps.fieldId || options.fieldId || 'NO_FIELD_ID',
      validate: ownProps.field.validate,
    }
  }
  // Pass in a component and it will get connected for you.
  return Component => {
    function mapStateToProps(state, ownProps) {
      const { formId, fieldId, validate, initialValue } = getInfo(ownProps)
      return {
        form: getState(selectForm(state), formId, fieldId, validate, initialValue),
      }
    }
    function mapDispatchToProps(dispatch, ownProps) {
      const { formId, fieldId } = getInfo(ownProps)
      return {
        action: bindActionCreators(getActions(formId, fieldId), dispatch),
      }
    }
    return connect(mapStateToProps, mapDispatchToProps)(Component)
  }
}
