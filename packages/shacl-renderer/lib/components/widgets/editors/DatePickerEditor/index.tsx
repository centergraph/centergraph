import { DataFactory } from 'n3'
import { WidgetProps } from '@centergraph/shacl-renderer/lib/types'
import { xsd } from '@centergraph/shacl-renderer/lib/helpers/namespaces'

export default function DatePickerEditor({ term, setTerm, settings, hasErrorsClassName }: WidgetProps) {
  return (
    <input
      type="date"
      className={`${settings.cssClasses[settings.mode].input} ${hasErrorsClassName ?? ''}`.trim()}
      value={term.value}
      onChange={(event) => setTerm(DataFactory.literal(event.target.value, xsd('date')))}
    />
  )
}
