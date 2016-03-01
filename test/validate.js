import isEmpty from 'lodash/isEmpty'

export function isRequired(value) {
  if (isEmpty(value)) {
    return 'Required'
  }
}

export function invalidDomain() {
  return 'invalid domain'
}
