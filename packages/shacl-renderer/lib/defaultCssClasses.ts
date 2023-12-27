import { Settings } from '@/types'

export default (mode: 'edit' | 'view') =>
  ({
    formLevel: 'form-level ps-3 pe-3',
    group: 'group',
    label: `form-label ${mode === 'view' ? 'd-inline' : ''}`,
    shaclProperty: `property ${mode === 'edit' ? 'mb-3' : ''}`,
    button: {
      primary: 'btn btn-primary',
      secondary: 'btn btn-sm btn-secondary ms-2',
    },
    input: 'form-control',
  } as Settings['cssClasses'])
