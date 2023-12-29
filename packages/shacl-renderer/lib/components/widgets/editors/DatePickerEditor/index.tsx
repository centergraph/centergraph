import { DataFactory } from 'n3'
import { WidgetProps } from '@/types'
import { xsd } from '@/helpers/namespaces'

export default function DatePickerEditor({ term, setTerm, settings, hasErrorsClassName }: WidgetProps) {
  return (
    <input
      type="date"
      className={`${settings.cssClasses.input} ${hasErrorsClassName ?? ''}`.trim()}
      value={term.value}
      onChange={(event) => setTerm(DataFactory.literal(event.target.value, xsd('date')))}
    />
  )
}
