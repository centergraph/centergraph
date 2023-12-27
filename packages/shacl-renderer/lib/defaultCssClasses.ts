import { Settings } from '@/types'

export default (mode: 'edit' | 'view'): Settings['cssClasses'] => ({
  formLevel: `form-level flex-grow-1 ${mode === 'edit' ? 'p-3' : 'ps-3'}`,
  group: 'group group-',
  label: `form-label ${mode === 'view' ? 'd-inline' : ''}`,
  shaclProperty: `property ${mode === 'edit' ? 'mb-3' : ''}`,
  propertyObject: mode === 'edit' ? 'd-flex input-group' : 'd-inline',
  button: {
    primary: 'btn btn-primary',
    secondary: 'btn btn-sm btn-secondary ms-2',
    danger: 'btn btn-sm btn-danger',
    remove: 'btn btn-sm btn-outline-danger',
  },
  input: 'form-control',
})
