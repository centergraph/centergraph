import { DataFactory } from 'n3'
import { WidgetProps } from '@/types'
import { xsd } from '@/helpers/namespaces'

export default function DatePickerEditor({ term, setTerm, settings }: WidgetProps) {
  return (
    <input
      type="date"
      className={settings.cssClasses.input}
      value={term.value}
      onChange={(event) => setTerm(DataFactory.literal(event.target.value, xsd('date')))}
    />
  )
}
