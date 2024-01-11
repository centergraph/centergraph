import { DataFactory } from 'n3'
import { WidgetProps } from '@centergraph/shacl-renderer/lib/types'

export default function TextFieldEditor({ term, setTerm, settings, hasErrorsClassName }: WidgetProps) {
  return (
    <input
      className={`${settings.cssClasses[settings.mode].input} ${hasErrorsClassName ?? ''}`.trim()}
      value={term.value}
      onChange={(event) => setTerm(DataFactory.literal(event.target.value))}
    />
  )
}
