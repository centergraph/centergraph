import { ReactNode } from 'react'
import { rdfs, sh, sr } from '@/helpers/namespaces'
import { lastPart } from '@/helpers/lastPart'
import { Settings } from '@/types'

export default function Group({
  children,
  groupPointer,
  settings,
}: {
  children?: ReactNode
  groupPointer: GrapoiPointer
  settings: Settings
}) {
  const label = groupPointer.out([sh('name'), rdfs('label')]).values[0]
  const className = lastPart(groupPointer.term)?.toLocaleLowerCase().replace(/ /g, '-')

  const cssClasses = groupPointer.out(sr('class')).values.join(' ')

  return children ? (
    <div className={`${settings.cssClasses.group}${className} ${cssClasses}`}>
      {label ? <h4 className="form-label">{label}</h4> : null}
      {children}
    </div>
  ) : null
}
