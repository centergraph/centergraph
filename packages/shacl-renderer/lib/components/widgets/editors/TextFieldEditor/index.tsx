import { DataFactory } from 'n3'
import { WidgetProps } from '../../../../types'

export default function TextFieldEditor({ term, setTerm }: WidgetProps) {
  return <input className="form-control" value={term.value} onChange={(event) => setTerm(DataFactory.literal(event.target.value))} />
}
