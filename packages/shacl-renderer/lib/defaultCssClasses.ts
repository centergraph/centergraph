import { CssClasses } from './types'

export default (mode: 'edit' | 'view'): CssClasses => ({
  formLevel: `level flex-grow-1 ${mode === 'edit' ? 'p-3' : 'ps-3'}`,
  group: 'group group-[ID]',
  label: `form-label ${mode === 'view' ? 'd-inline' : ''}`,
  shaclProperty: mode === 'edit' ? `property [ID] d-flex flex-column mb-3` : '',
  propertyObject: mode === 'edit' ? 'd-flex input-group' : '',
  propertyObjectWrapper: mode === 'edit' ? 'property-wrapper [ID]' : '',
  button: {
    primary: 'btn btn-primary',
    secondary: 'btn btn-sm btn-secondary ms-2',
    danger: 'btn btn-sm btn-danger',
    remove: 'btn btn-sm btn-outline-danger remove-button',
    add: 'btn btn-sm btn-outline-secondary ms-auto mt-2',
  },
  errorMessage: 'alert alert-danger mt-1',
  hasErrors: 'is-invalid',
  input: mode === 'edit' ? 'form-control' : '',
})
