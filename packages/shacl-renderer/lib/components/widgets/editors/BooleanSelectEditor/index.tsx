import { DataFactory } from 'n3'
import { WidgetProps } from '@centergraph/shacl-renderer/lib/types'
import { xsd } from '@centergraph/shacl-renderer/lib/helpers/namespaces'
import { useState } from 'react'
import { randomId } from '@centergraph/shacl-renderer/lib/helpers/randomId'

export default function BooleanSelectEditor({ term, setTerm }: WidgetProps) {
  const [htmlId] = useState('id-' + randomId())

  return (
    <div className="form-check d-flex flex-grow-1 form-control mb-0 ps-3">
      <input
        onChange={(event) => setTerm(DataFactory.literal(event.target.checked.toString(), xsd('boolean')))}
        value="true"
        id={htmlId}
        className="form-check-input mb-0 ms-0"
        type="checkbox"
        checked={term.value === 'true'}
      />
      <label className="form-check-label ms-2 mb-0 d-flex flex-grow-1 " htmlFor={htmlId}>
        &nbsp;
      </label>
    </div>
  )
}
