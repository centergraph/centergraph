import { DataFactory } from 'n3'
import { WidgetProps } from '../../../../types'
import { xsd } from '../../../../helpers/namespaces'

export default function DatePickerEditor({ term, setTerm }: WidgetProps) {
  return (
    <input
      type="date"
      className="form-control"
      value={term.value}
      onChange={(event) => setTerm(DataFactory.literal(event.target.value, xsd('date')))}
    />
  )
}
