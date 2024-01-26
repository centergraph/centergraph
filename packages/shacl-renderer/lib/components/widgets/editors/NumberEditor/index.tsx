import { DataFactory } from 'n3'
import { WidgetProps } from '@centergraph/shacl-renderer/lib/types'
import { sh } from '@centergraph/shacl-renderer/lib/helpers/namespaces'

export default function NumberEditor({ term, setTerm, settings, hasErrorsClassName, shaclPointer }: WidgetProps) {
  const datatype = shaclPointer.out(sh('datatype')).term

  return (
    <input
      type="number"
      className={`${settings.cssClasses[settings.mode].input} ${hasErrorsClassName ?? ''}`.trim()}
      value={term.value}
      onChange={(event) => setTerm(DataFactory.literal(event.target.value.toString(), datatype))}
    />
  )
}
