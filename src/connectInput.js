import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { getFormEvents } from './actions'
import { selectFieldValue, selectPrefix } from './select'

export const mapStateToProps = createStructuredSelector({
  value: selectFieldValue,
})

export function mapDispatchToProps(dispatch, ownProps) {
  return bindActionCreators(getFormEvents(selectPrefix(ownProps)), dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)
