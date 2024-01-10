import { DataFactory } from 'n3'
import { WidgetProps } from '@centergraph/shacl-renderer/lib/types'
import { sh } from '@centergraph/shacl-renderer/lib/helpers/namespaces'
import { lastPart } from '@centergraph/shacl-renderer/lib/helpers/lastPart'

export default function EnumSelectEditor({ term, setTerm, shaclPointer, hasErrorsClassName }: WidgetProps) {
  return (
    <select
      value={term.value}
      onChange={(event) => setTerm(DataFactory.namedNode(event.target.value))}
      className={`form-select ${hasErrorsClassName ?? ''}`}
    >
      {!term.value ? <option value={''}>- Select -</option> : null}
      {[...shaclPointer.out(sh('in')).list()].map((item) => (
        <option key={item.term.value} value={item.term.value}>
          {lastPart(item.term.value)}
        </option>
      ))}
    </select>
  )
}
