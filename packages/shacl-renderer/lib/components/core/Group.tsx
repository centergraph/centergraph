import { ReactNode } from 'react'
import { rdfs, sh } from '../../helpers/namespaces'
import { lastPart } from '../../helpers/lastPart'

export default function Group({ children, groupPointer }: { children?: ReactNode; groupPointer: GrapoiPointer }) {
  const label = groupPointer.out([sh('name'), rdfs('label')]).values[0]
  const className = lastPart(groupPointer.term)?.toLocaleLowerCase().replace(/ /g, '-')

  return children ? (
    <div className={`group group-${className}`}>
      {label ? <h4 className="form-label">{label}</h4> : null}
      {children}
    </div>
  ) : null
}
